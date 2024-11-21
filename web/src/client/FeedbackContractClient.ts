import { useMutation, useQuery } from '@tanstack/vue-query';

import {
  FeedbackContractABI,
  FEEDBACK_CONTRACT_ADDRESS,
} from './contracts/FeedbackContract';
import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import { decodeBytes32String, encodeBytes32String, toBeHex } from 'ethers';

import { CreateClientArgs } from './contracts';

export const getFeedbackContractClient = (args: CreateClientArgs) => {
  const {
    queryClient,
    // publicClient,
    // walletClient,
    walletServerClient: walletClient,
    publicServerClient: publicClient,
    semaphore,
    account,
  } = args;
  const GROUP_ID = '0';

  const joinGroup = useMutation({
    mutationKey: ['joinGroup'],
    mutationFn: async (args: { groupId: string; identity: Identity }) => {
      const { groupId, identity } = args;

      // Prepare the transaction
      const transactionHash = await walletClient.writeContract({
        address: FEEDBACK_CONTRACT_ADDRESS,
        abi: FeedbackContractABI.abi,
        functionName: 'joinGroup',
        args: [identity.commitment],
        account: account.value,
      });

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });

      return receipt;
    },
    onError: (error) => {
      console.error('joinGroup error', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
  });

  const sendFeedback = useMutation({
    mutationKey: ['sendFeedback'],
    mutationFn: async (args: {
      // groupId: bigint;
      feedback: string;
      _identity: Identity;
    }) => {
      const { feedback, _identity } = args;

      const _users = [...(getUsers.data.value?.at(0)?.members ?? [])];

      const group = new Group(_users);

      const message = encodeBytes32String(feedback);

      const NEXT_PUBLIC_GROUP_ID = '0';

      const { points, merkleTreeDepth, merkleTreeRoot, nullifier } =
        await generateProof(_identity, group, message, NEXT_PUBLIC_GROUP_ID);

      const txHash = await walletClient.writeContract({
        address: FEEDBACK_CONTRACT_ADDRESS,
        abi: FeedbackContractABI.abi,
        functionName: 'sendFeedback',
        account: account.value,
        args: [
          BigInt(merkleTreeDepth),
          merkleTreeRoot,
          nullifier,
          BigInt(message),
          points,
        ],
      });

      // Warten, bis die Transaktion bestätigt ist
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      return receipt;
    },
    onError: (error) => {
      console.error('sendFeedback error', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFeedback'] });
    },
  });

  const getUsers = useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      const groupIds = await semaphore.getGroupIds();

      const groupsWithUsers = await Promise.all(
        groupIds.map(async (groupId) => {
          const members = await semaphore.getGroupMembers(groupId);

          return {
            groupId,
            members,
          };
        }),
      );
      // TODO: remove
      semaphore.getGroupMembers('0').catch(console.error).then(console.log);

      return groupsWithUsers;
    },
  });

  const getFeedback = (args: { groupId: string }) => {
    const { groupId } = args;

    return useQuery({
      queryKey: ['getFeedback', groupId],
      queryFn: async () => {
        type GroupValidatedProof = {
          merkleTreeDepth: number;
          merkleTreeRoot: string;
          nullifier: string;
          message: string;
          scope: string;
          points: string[];
        };

        const proofs: GroupValidatedProof[] =
          await semaphore.getGroupValidatedProofs(groupId);

        const feedback: string[] = proofs.map(({ message }) =>
          decodeBytes32String(toBeHex(message, 32)),
        );

        return feedback;
      },
    });
  };

  return {
    joinGroup,
    sendFeedback,
    getUsers,
    getFeedback,
  };
};
