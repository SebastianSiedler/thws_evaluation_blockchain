import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { Address, createPublicClient, createWalletClient, custom } from 'viem';
import { anvil } from 'viem/chains';
import { transactions } from '../../../broadcast/Counter.s.sol/31337/run-latest.json';
import { useAsyncState } from '@vueuse/core';
import { computed } from 'vue';

// TODO: replace with json import
const CONTRACT_ADDRESS: Address = transactions[0].contractAddress;

// ABI for the smart contract
// TODO: replace with json import
export const ABI = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setNumber',
    inputs: [{ name: 'newNumber', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const getClient = () => {
  const queryClient = useQueryClient();

  const walletClient = createWalletClient({
    chain: anvil, // or mainnet if on mainnet
    transport: custom(window.ethereum!),
  });

  const publicClient = createPublicClient({
    chain: anvil, // or mainnet if on mainnet
    transport: custom(window.ethereum!),
  });

  const accounts = useAsyncState(walletClient.getAddresses, []);
  const account = computed(() => accounts.state.value[0]);

  const getNumberQuery = useQuery({
    queryKey: ['getNumber'],
    queryFn: async () => {
      return publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'number',
      });
    },
  });

  const incrementNumberMutation = useMutation({
    mutationKey: ['incrementNumber'],
    mutationFn: async () => {
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'increment',
        account: account.value,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNumber'] });
    },
  });

  const setNumberMutation = useMutation({
    mutationKey: ['setNumber'],
    mutationFn: async (newNumber: bigint) => {
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'setNumber',
        account: account.value,
        args: [newNumber],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNumber'] });
    },
  });

  return {
    getNumberQuery,
    incrementNumberMutation,
    setNumberMutation,
  };
};
