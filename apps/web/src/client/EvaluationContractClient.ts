import { evaluationContractPlatform } from '@acme/contracts/clients/ethers/evaluation';
import { semaphore } from '@acme/contracts/clients/ethers/semaphore';
import { Identity } from '@semaphore-protocol/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useAsyncState } from '@vueuse/core';
import { AddressLike, isError } from 'ethers';

import { useEvaluationStore } from 'src/stores/evaluationStore';
import { relayerClient } from './relayer';
import { getGroupMessages } from './utils';

export const getEvaluationContractClient = () => {
  const { rpcContract } = evaluationContractPlatform.getRpcContract();

  const browserContract = useAsyncState(
    evaluationContractPlatform.getBrowserContract,
    null,
    {
      throwError: true,
    },
  );

  const queryClient = useQueryClient();

  const evaluationStore = useEvaluationStore();

  const createEvaluation = useMutation({
    mutationKey: ['createEvaluation'],
    mutationFn: async (args: { name: string }) => {
      const { name } = args;

      const browserContractState = browserContract.state.value?.browserContract;
      if (!browserContractState) {
        throw new Error('No ethereum provider found');
      }

      const txHash = await browserContractState.createEvaluation(name);
      const receipt = await txHash.wait();

      return {
        receipt,
      };
    },
    onError: (err) => {
      if (isError(err, 'CALL_EXCEPTION')) {
        throw new Error(err.reason ?? 'Transaction failed');
      }
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getEvaluations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getCreatorEvaluations'],
      });
    },
  });

  const addParticipant = useMutation({
    mutationKey: ['addParticipant'],
    mutationFn: async (args: {
      evaluationId: bigint;
      identityCommitment: bigint;
    }) => {
      const { evaluationId, identityCommitment } = args;

      const txHash = await rpcContract.addParticipant(
        evaluationId,
        identityCommitment,
      );

      const receipt = await txHash.wait();

      return { receipt, evaluationId };
    },
    onError: (err) => {
      if (isError(err, 'CALL_EXCEPTION')) {
        throw new Error(err.reason ?? 'Transaction failed');
      }
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
      const response = await relayerClient.vote({
        body: {
          groupId: args.groupId,
          identityPk: args._identity.export(),
          vote: args.vote,
        },
      });

      if (response.status === 500) {
        throw new Error(response.body.message);
      }

      return { groupId: args.groupId };
    },
    onError: (err) => {
      console.error('vote error: ', err);
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
        return groupMembers.map((x) => BigInt(x));
      },
    });
  };

  const finalizeEvaluation = useMutation({
    mutationKey: ['finalizeEvaluation'],
    mutationFn: async (args: { groupId: string }) => {
      const { groupId } = args;

      const txHash = await rpcContract.finalizeEvaluation(BigInt(groupId));

      const receipt = await txHash.wait();

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
        const evaluationData = await rpcContract.getEvaluation(BigInt(groupId));
        return evaluationData;
      },
    });
  };

  const getCreatorEvaluationList = (msgSenderAddress: AddressLike) => {
    return useQuery({
      queryKey: ['getCreatorEvaluations', msgSenderAddress],
      queryFn: async () => {
        return await rpcContract.getCreatorEvaluationList(msgSenderAddress);
      },
    });
  };

  /**
   * Get the list of evaluations where the participant is a member
   */
  const getParticipantEvaluationList = (args: {
    identityCommitment: string;
  }) => {
    return useQuery({
      queryKey: ['getParticipantEvaluations', args.identityCommitment],
      queryFn: async () => {
        const evaluationList = await rpcContract.getParticipantEvaluationList(
          args.identityCommitment,
        );

        return evaluationList;
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
    getCreatorEvaluationList,
    getParticipantEvaluationList,
  };
};
