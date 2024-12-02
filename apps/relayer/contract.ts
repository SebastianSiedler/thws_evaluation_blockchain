// contract.ts

import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const PostVoteSchema = z.object({
  groupId: z.string(),
  identityPk: z.string(),
  vote: z.string(),
});
export type PostVote = z.infer<typeof PostVoteSchema>;

export const contract = c.router({
  vote: {
    method: "POST",
    path: "/vote/",
    body: PostVoteSchema,
    responses: {
      200: null,
    },
    summary: "Vote",
  },
});
