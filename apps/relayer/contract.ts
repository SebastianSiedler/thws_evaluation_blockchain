// contract.ts

import { SemaphoreProof } from '@semaphore-protocol/core';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const PostVoteSchema = z.object({
  groupId: z.string(),
  identityPk: z.string(),
  vote: z.string(),
});
export type PostVote = z.infer<typeof PostVoteSchema>;

export const postVoteSchema2: z.ZodSchema<SemaphoreProof> = z.object({
  merkleTreeDepth: z.number(),
  merkleTreeRoot: z.string(),
  message: z.string(),
  nullifier: z.string(),
  scope: z.string(),
  points: z.tuple([
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
  ]),
});

export const contract = c.router({
  vote: {
    method: 'POST',
    path: '/vote/',
    body: postVoteSchema2,
    responses: {
      200: null,
      500: c.type<{ message: string }>(),
    },
    summary: 'Vote',
  },
});
