import { evaluationContractPlatform } from '@acme/contracts/clients/ethers/evaluation';
import { semaphore } from '@acme/contracts/clients/ethers/semaphore';
import { SEMAPHORE_CONTRACT_ADDRESS } from '@acme/contracts/deployed_addresses.json';
import { EvaluationPlatform } from '@acme/contracts/typechain-types';
import cors from '@fastify/cors';
import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import { SemaphoreEthers } from '@semaphore-protocol/data';
import { initServer } from '@ts-rest/fastify';
import { encodeBytes32String, isError } from 'ethers';
import Fastify from 'fastify';

import { contract } from './contract';

const app = Fastify();
let evaluationContract: EvaluationPlatform;

app.register(cors, {
  origin: '*', //TODO: .env only :9000
});

const s = initServer();

export const router = s.router(contract, {
  vote: async ({ body }) => {
    console.log('vote');
    const { vote, identityPk, groupId } = body;

    const _users = await semaphore.getGroupMembers(groupId);
    console.log({ _users });
    const group = new Group(_users);

    const message = encodeBytes32String(vote);

    const _identity = Identity.import(identityPk);
    console.log('received identity', _identity.commitment.toString());

    const proof = await generateProof(_identity, group, message, groupId);
    // console.log({ proof });

    // console.log(message, proof.message);

    const txResponse = await evaluationContract
      .vote(
        groupId,
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        BigInt(message),
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
  },
});

app.register(s.plugin(router));

const start = async () => {
  const { rpcContract } = evaluationContractPlatform.getRpcContract();
  evaluationContract = rpcContract;

  try {
    console.log('Starting server...', { port: 3000 });
    await app.listen({ port: 3000 });
  } catch (err) {
    console.error(err);
    app.log.error(err);
    process.exit(1);
  }
};

start();
