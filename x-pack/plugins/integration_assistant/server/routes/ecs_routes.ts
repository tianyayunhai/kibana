/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { IKibanaResponse, IRouter } from '@kbn/core/server';
import { getRequestAbortedSignal } from '@kbn/data-plugin/server';
import {
  ActionsClientChatOpenAI,
  ActionsClientSimpleChatModel,
} from '@kbn/langchain/server/language_models';
import { APMTracer } from '@kbn/langchain/server/tracers/apm';
import { getLangSmithTracer } from '@kbn/langchain/server/tracers/langsmith';
import { ECS_GRAPH_PATH, EcsMappingRequestBody, EcsMappingResponse } from '../../common';
import { ROUTE_HANDLER_TIMEOUT } from '../constants';
import { getEcsGraph } from '../graphs/ecs';
import type { IntegrationAssistantRouteHandlerContext } from '../plugin';
import { buildRouteValidationWithZod } from '../util/route_validation';
import { withAvailability } from './with_availability';

export function registerEcsRoutes(router: IRouter<IntegrationAssistantRouteHandlerContext>) {
  router.versioned
    .post({
      path: ECS_GRAPH_PATH,
      access: 'internal',
      options: {
        timeout: {
          idleSocket: ROUTE_HANDLER_TIMEOUT,
        },
      },
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            body: buildRouteValidationWithZod(EcsMappingRequestBody),
          },
        },
      },
      withAvailability(async (context, req, res): Promise<IKibanaResponse<EcsMappingResponse>> => {
        const { packageName, dataStreamName, rawSamples, mapping, langSmithOptions } = req.body;
        const { getStartServices, logger } = await context.integrationAssistant;

        const [, { actions: actionsPlugin }] = await getStartServices();
        try {
          const actionsClient = await actionsPlugin.getActionsClientWithRequest(req);
          const connector = req.body.connectorId
            ? await actionsClient.get({ id: req.body.connectorId })
            : (await actionsClient.getAll()).filter(
                (connectorItem) => connectorItem.actionTypeId === '.bedrock'
              )[0];

          const abortSignal = getRequestAbortedSignal(req.events.aborted$);
          const isOpenAI = connector.actionTypeId === '.gen-ai';

          const llmClass = isOpenAI ? ActionsClientChatOpenAI : ActionsClientSimpleChatModel;

          const model = new llmClass({
            actionsClient,
            connectorId: connector.id,
            logger,
            llmType: isOpenAI ? 'openai' : 'bedrock',
            model: connector.config?.defaultModel,
            temperature: 0.05,
            maxTokens: 4096,
            signal: abortSignal,
            streaming: false,
          });

          const parameters = {
            packageName,
            dataStreamName,
            rawSamples,
            ...(mapping && { mapping }),
          };

          const options = {
            callbacks: [
              new APMTracer({ projectName: langSmithOptions?.projectName ?? 'default' }, logger),
              ...getLangSmithTracer({ ...langSmithOptions, logger }),
            ],
          };

          const graph = await getEcsGraph({ model });
          const results = await graph.invoke(parameters, options);

          return res.ok({ body: EcsMappingResponse.parse(results) });
        } catch (e) {
          return res.badRequest({ body: e });
        }
      })
    );
}
