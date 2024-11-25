import { useMutation, useQuery } from '@tanstack/vue-query';

import type { CreateClientArgs } from './contracts';
import {
  COUNTER_CONTRACT_ADDRESS,
  CounterContract,
} from './contracts/CounterContract';

export const getCounterClient = (args: CreateClientArgs) => {
  const { queryClient, publicClient, walletClient, account } = args;
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
