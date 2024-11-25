import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { encodeBytes32String } from 'ethers';

import type { CreateClientArgs } from './contracts';
import {
  EVALUATION_CONTRACT_ABI,
  EVALUATION_CONTRACT_ADDRESS,
} from './contracts/EvaluationContract';
import { getGroupMessages, getRevertReason } from './utils';

export const getEvaluationContractClient = (args: CreateClientArgs) => {
  const {
    queryClient,
    publicClient,
    // walletClient,
    walletServerClient: walletClient,
    publicServerClient,
    semaphore,
    account,
  } = args;

  const createEvaluation = useMutation({
    mutationKey: ['createEvaluation'],
    mutationFn: async (args: {}) => {
      const {} = args;

      const txHash = await walletClient.writeContract({
        address: EVALUATION_CONTRACT_ADDRESS,
        abi: EVALUATION_CONTRACT_ABI,
        functionName: 'createEvaluation',
        account: account.value,
        args: [],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'reverted') {
        const reason = await getRevertReason({
          transactionHash: txHash,
          publicClient: publicClient,
        });
        throw new Error(reason?.shortMessage ?? 'unknown error');
      }

      return receipt;
    },
    onError: (err) => {
      console.error('createEvaluation error', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluations'] });
    },
  });

  const addParticipant = useMutation({
    mutationKey: ['addParticipant'],
    mutationFn: async (args: {
      evaluationId: bigint;
      identityCommitment: bigint;
    }) => {
      const { evaluationId, identityCommitment } = args;

      const txHash = await walletClient.writeContract({
        address: EVALUATION_CONTRACT_ADDRESS,
        abi: EVALUATION_CONTRACT_ABI,
        functionName: 'addParticipant',
        account: account.value,
        args: [evaluationId, identityCommitment],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'reverted') {
        const reason = await getRevertReason({
          transactionHash: txHash,
          publicClient: publicClient,
        });
        throw new Error(reason?.shortMessage ?? 'unknown error');
      }

      return { receipt, evaluationId };
    },
    onError: (err) => {
      console.error('addParticipant error', err);
    },
    onSuccess: ({ evaluationId }) => {
      queryClient.invalidateQueries({
        queryKey: ['getEvaluationMembers', evaluationId.toString()],
      });
    },
  });

  const vote = useMutation({
    mutationKey: ['vote'],
    mutationFn: async (args: {
      vote: string;
      _identity: Identity;
      groupId: string;
    }) => {
      const { vote, _identity, groupId } = args;
      console.log({ args });

      const _users = await semaphore.getGroupMembers(groupId);
      console.log({ _users });
      const group = new Group(_users);

      const message = encodeBytes32String(vote);

      console.log('generating proof: ', { _identity, group, message, groupId });
      //         await generateProof(_identity, group, message, NEXT_PUBLIC_GROUP_ID);
      const proof = await generateProof(_identity, group, message, groupId);
      console.log({ proof });

      console.log(message, proof.message);

      const txHash = await walletClient.writeContract({
        address: EVALUATION_CONTRACT_ADDRESS,
        abi: EVALUATION_CONTRACT_ABI,
        functionName: 'vote',
        account: account.value,
        args: [
          BigInt(groupId),
          BigInt(proof.merkleTreeDepth),
          proof.merkleTreeRoot,
          proof.nullifier,
          BigInt(message),
          proof.points,
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'reverted') {
        const reason = await getRevertReason({
          transactionHash: txHash,
          publicClient: publicClient,
        });
        throw new Error(reason?.shortMessage ?? 'unknown error');
      }

      return { receipt, groupId };
    },
    onError: (err) => {
      console.error('vote error', err);
    },
    onSuccess: ({ groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluations', groupId] });
    },
  });

  const getEvaluationMessages = (args: { groupId: string }) => {
    const { groupId } = args;
    return useQuery({
      queryKey: ['getEvaluations', groupId],
      queryFn: async () => {
        return getGroupMessages({
          semaphore,
          groupId,
        });
      },
    });
  };

  const getEvaluationList = useQuery({
    queryKey: ['getEvaluations'],
    queryFn: async () => {
      const groupIds = await semaphore.getGroupIds();
      return groupIds.map((groupId) => ({ groupId }));
    },
  });

  const getEvaluationMembers = (args: { groupId: string }) => {
    const { groupId } = args;

    return useQuery({
      queryKey: ['getEvaluationMembers', groupId],
      queryFn: async () => {
        const groupMembers = await semaphore.getGroupMembers(groupId);
        return groupMembers;
      },
    });
  };

  const finalizeEvaluation = useMutation({
    mutationKey: ['finalizeEvaluation'],
    mutationFn: async (args: { groupId: string }) => {
      const { groupId } = args;

      const txHash = await walletClient.writeContract({
        address: EVALUATION_CONTRACT_ADDRESS,
        abi: EVALUATION_CONTRACT_ABI,
        functionName: 'finalizeEvaluation',
        account: account.value,
        args: [BigInt(groupId)],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'reverted') {
        const reason = await getRevertReason({
          transactionHash: txHash,
          publicClient: publicClient,
        });
        throw new Error(reason?.shortMessage ?? 'unknown error');
      }

      return { receipt, groupId };
    },
    onError: (err) => {
      console.error('finalizeEvaluation error', err);
    },
    onSuccess: ({ groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluations', groupId] });
    },
  });

  const getEvaluation = (args: { groupId: string }) => {
    const { groupId } = args;
    return useQuery({
      queryKey: ['getEvaluation', groupId],
      queryFn: async () => {
        return publicServerClient.readContract({
          address: EVALUATION_CONTRACT_ADDRESS,
          abi: EVALUATION_CONTRACT_ABI,
          functionName: 'getEvaluation',
          args: [BigInt(groupId)],
        });
      },
    });
  };

  return {
    createEvaluation,
    addParticipant,
    vote,
    finalizeEvaluation,
    getEvaluationMessages,
    getEvaluationList,
    getEvaluation,
    getEvaluationMembers,
  };
};
