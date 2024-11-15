import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { anvil } from 'viem/chains';
import { useAsyncState } from '@vueuse/core';
import { computed } from 'vue';
import {
  COUNTER_CONTRACT_ADDRESS,
  CounterContract,
} from './contracts/CounterContract';

export const getClient = () => {
  const queryClient = useQueryClient();

  /**
   * Wallet client is used to write to contracts
   */
  const walletClient = createWalletClient({
    chain: anvil, // or mainnet if on mainnet
    transport: custom(window.ethereum!),
  });

  /**
   * Public client is used to read contract state
   */
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
        address: COUNTER_CONTRACT_ADDRESS,
        abi: CounterContract.abi,
        functionName: 'number',
      });
    },
  });

  const incrementNumberMutation = useMutation({
    mutationKey: ['incrementNumber'],
    mutationFn: async () => {
      const txHash = await walletClient.writeContract({
        address: COUNTER_CONTRACT_ADDRESS,
        abi: CounterContract.abi,
        functionName: 'increment',
        account: account.value,
      });

      // Warten, bis die Transaktion bestätigt ist
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNumber'] });
    },
  });

  const setNumberMutation = useMutation({
    mutationKey: ['setNumber'],
    mutationFn: async (newNumber: bigint) => {
      const txHash = await walletClient.writeContract({
        address: COUNTER_CONTRACT_ADDRESS,
        abi: CounterContract.abi,
        functionName: 'setNumber',
        account: account.value,
        args: [newNumber],
      });

      // Warten, bis die Transaktion bestätigt ist
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      return receipt;
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