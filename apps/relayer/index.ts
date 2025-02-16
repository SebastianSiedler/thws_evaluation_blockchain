import { evaluationContractPlatform } from '@acme/contracts/clients/ethers/evaluation';
import { getSemaphore } from '@acme/contracts/clients/ethers/semaphore';
import { EvaluationPlatform } from '@acme/contracts/typechain-types';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import { SemaphoreEthers } from '@semaphore-protocol/data';
import { initServer } from '@ts-rest/fastify';
import { generateOpenApi } from '@ts-rest/open-api';
import { encodeBytes32String, isError } from 'ethers';
import Fastify, { FastifyInstance } from 'fastify';

import { contract } from './contract';
import { env } from './env';

const app = Fastify();
let evaluationContract: EvaluationPlatform;

app.register(cors, {
  // allow only request from env.VITE_WEB_DAPP_URL
  // origin: env.VITE_WEB_DAPP_URL,
  origin: '*', // TODO: .env
});

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Posts API',
    version: '1.0.0',
  },
});

// Function to setup Swagger
export async function setupSwagger(app: FastifyInstance) {
  // Register Swagger plugin
  // @ts-expect-error - fastify-swagger types are incorrect but it does still work
  await app.register(swagger, {
    openapi: openApiDocument,
    hideUntagged: true,
  });

  // Register Swagger UI plugin
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
  });
}

const s = initServer();

const semaphore = getSemaphore({
  VITE_ETH_NETWORK_URL: env.VITE_ETH_NETWORK_URL,
  VITE_SEMAPHORE_CONTRACT_ADDRESS: env.VITE_SEMAPHORE_CONTRACT_ADDRESS,
});

export const router = s.router(contract, {
  vote: async ({ body: proof }) => {
    try {
      // console.log('vote');
      // const { vote, identityPk, groupId } = body;

      // const _users = await semaphore.getGroupMembers(groupId);
      // console.log({ _users });
      // const group = new Group(_users);

      // const message = encodeBytes32String(vote);

      // const _identity = Identity.import(identityPk);
      // console.log('received identity', _identity.commitment.toString());

      // const proof = await generateProof(_identity, group, message, groupId);
      // // console.log({ proof });

      // console.log(message, proof.message);
      const txResponse = await evaluationContract
        .vote(
          proof.scope,
          proof.merkleTreeDepth,
          proof.merkleTreeRoot,
          proof.nullifier,
          BigInt(proof.message),
          proof.points,
        )
        .catch((err) => {
          console.error(err);
          if (isError(err, 'CALL_EXCEPTION')) {
            console.log('CALL_EXCEPTION', 'asdfasdf');
            console.log(err.info?.error);
            if (
              err.info?.error?.message?.indexOf(
                'Semaphore__YouAreUsingTheSameNullifierTwice',
              ) !== -1
            ) {
              throw new Error('You have already voted!');
            }
            throw new Error(
              err.reason ??
                err.shortMessage ??
                err.message ??
                'Unkown CALL_EXCEPTION',
            );
          } else {
            throw err;
          }
        });

      const txReceipt = await txResponse.wait();

      console.log({ txReceipt });

      if (txReceipt?.status !== 1) {
        throw new Error('Transaction failed');
      }

      return {
        status: 200,
        body: null,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 400,
        body: {
          message: 'error',
        },
      };
    }
  },
});

app.register(s.plugin(router));

const start = async () => {
  await setupSwagger(app);

  const { rpcContract } = evaluationContractPlatform.getRpcContract({
    VITE_ETH_RELAYER_PK: env.VITE_ETH_RELAYER_PK,
    VITE_ETH_NETWORK_URL: env.VITE_ETH_NETWORK_URL,
    VITE_EVALUATION_CONTRACT_ADDRESS: env.VITE_EVALUATION_CONTRACT_ADDRESS,
  });
  evaluationContract = rpcContract;

  try {
    const PORT = env.VITE_RELAYER_PORT;
    console.log('Starting server...', {
      address: env.VITE_RELAYER_ADDRESS,
      port: PORT,
    });
    await app.listen({ host: env.VITE_RELAYER_ADDRESS, port: PORT }); // TODO: .env
  } catch (err) {
    console.error(err);
    app.log.error(err);
    process.exit(1);
  }
};

start();
