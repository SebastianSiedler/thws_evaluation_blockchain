import { useMutation, useQuery } from '@tanstack/vue-query';
import { createWalletClient, http } from 'viem';
import { anvil } from 'viem/chains';

import {
  FeedbackContractABI,
  FEEDBACK_CONTRACT_ADDRESS,
} from './contracts/FeedbackContract';
import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import {
  Contract,
  decodeBytes32String,
  encodeBytes32String,
  JsonRpcProvider,
  toBeHex,
  Wallet,
} from 'ethers';
import { SemaphoreEthers } from '@semaphore-protocol/data';
import { privateKeyToAccount } from 'viem/accounts';
import { SEMAPHORE_CONTRACT_ADDRESS } from './contracts/SemaphoreContract';
import { CreateClientArgs } from './contracts';

export const getFeedbackContractClient = (args: CreateClientArgs) => {
  const { queryClient, publicClient, walletClient } = args;
  const GROUP_ID = '0';

  const joinGroup = useMutation({
    mutationKey: ['joinGroup'],
    mutationFn: async (args: { groupId: string; identity: Identity }) => {
      const { groupId, identity } = args;

      // Configure the provider
      const providerUrl = 'http://127.0.0.1:8545';

      // Configure the signer
      const ethereumPrivateKey =
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      const account = privateKeyToAccount(ethereumPrivateKey);

      const walletClient = createWalletClient({
        chain: anvil, // Replace with your chain, if applicable
        transport: http(providerUrl),
        // transport: custom(window.ethereum!),
        // account,
      });

      // Prepare the transaction
      const transactionHash = await walletClient.writeContract({
        address: FEEDBACK_CONTRACT_ADDRESS,
        abi: FeedbackContractABI.abi,
        functionName: 'joinGroup',
        args: [identity.commitment],
        account: account,
      });

      console.log('Transaction Hash:', transactionHash);

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      console.log('Transaction Receipt:', receipt);

      // const txHash = await walletClient.writeContract({
      //   address: FEEDBACK_CONTRACT_ADDRESS,
      //   abi: FeedbackContractABI.abi,
      //   functionName: 'joinGroup',
      //   account: account.value,
      //   args: [identity.commitment],
      // });
      // console.log('txHash', txHash);

      // // Warten, bis die Transaktion bestätigt ist
      // const receipt = await publicClient.waitForTransactionReceipt({
      //   hash: txHash,
      // });
      // console.log(receipt);
      // return receipt;
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
      console.log('sending feedback...');
      const { feedback, _identity } = args;

      console.log({ _identity });

      const _users = [...(getUsers.data.value?.at(0)?.members ?? [])];
      console.log({ _users });
      const group = new Group(_users);
      console.log('created group', group);

      const message = encodeBytes32String(feedback);
      console.log('created message', { message, feedback });

      const NEXT_PUBLIC_GROUP_ID = '0';

      const { points, merkleTreeDepth, merkleTreeRoot, nullifier } =
        await generateProof(_identity, group, message, NEXT_PUBLIC_GROUP_ID);
      console.log('created proof', points, merkleTreeDepth, merkleTreeRoot);

      // Configure the provider
      const providerUrl = 'http://127.0.0.1:8545';

      // Configure the signer
      const ethereumPrivateKey =
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

      const provider = new JsonRpcProvider(providerUrl);

      const signer = new Wallet(ethereumPrivateKey, provider);
      const contract = new Contract(
        FEEDBACK_CONTRACT_ADDRESS,
        FeedbackContractABI.abi,
        signer,
      );
      console.log('sending feedback...', { feedback, message });
      const transaction = await contract.sendFeedback(
        merkleTreeDepth,
        merkleTreeRoot,
        nullifier,
        message,
        points,
      );
      console.log('sending feedback done!');
      console.log('Transaction:', transaction);
      const receipe = await transaction.wait();
      console.log('Transaction Receipt:', receipe);

      return receipe;

      // const walletClient = createWalletClient({
      //   chain: hardhat, // Replace with your chain, if applicable
      //   transport: http(providerUrl),
      //   // transport: custom(window.ethereum!),
      //   // account,
      // });

      // console.log('writing to contract...');
      // const txHash = await walletClient.writeContract({
      //   address: FEEDBACK_CONTRACT_ADDRESS,
      //   abi: FeedbackContractABI.abi,
      //   functionName: 'sendFeedback',
      //   account: account,
      //   args: [
      //     BigInt(merkleTreeDepth),
      //     merkleTreeRoot,
      //     nullifier,
      //     message,
      //     points,
      //   ],
      // });
      // console.log('txHash', txHash);

      // // Warten, bis die Transaktion bestätigt ist
      // const receipt = await publicClient.waitForTransactionReceipt({
      //   hash: txHash,
      // });
      // return receipt;
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
      const ethereumNetwork = 'http://127.0.0.1:8545';
      const semaphore = new SemaphoreEthers(ethereumNetwork, {
        address: SEMAPHORE_CONTRACT_ADDRESS, // NEXT.JS
        // address: '0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f', // ANVIL
        // address: SEMAPHORE_CONTRACT_ADDRESS,
        // projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      });

      const groupIds = await semaphore.getGroupIds();
      console.log({ groupIds });

      const groupsWithUsers = await Promise.all(
        groupIds.map(async (groupId) => {
          const members = await semaphore.getGroupMembers(groupId);

          return {
            groupId,
            members,
          };
        }),
      );
      console.log({ groupsWithUsers });

      semaphore.getGroupMembers('0').catch(console.error).then(console.log);

      return groupsWithUsers;
    },
  });

  const getFeedback = useQuery({
    queryKey: ['getFeedback'],
    queryFn: async () => {
      const ethereumNetwork = 'http://127.0.0.1:8545';
      const semaphore = new SemaphoreEthers(ethereumNetwork, {
        address: SEMAPHORE_CONTRACT_ADDRESS,
        // projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      });

      const proofs = await semaphore.getGroupValidatedProofs(GROUP_ID);

      const feedback: string[] = proofs.map(({ message }: any) =>
        decodeBytes32String(toBeHex(message, 32)),
      );

      return feedback;
    },
  });

  return {
    joinGroup,
    sendFeedback,
    getUsers,
    getFeedback,
  };
};
