import { QueryClient, useQueryClient } from '@tanstack/vue-query';
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  CustomTransport,
  PublicClient,
  WalletClient,
} from 'viem';
import { anvil } from 'viem/chains';
import { useAsyncState } from '@vueuse/core';
import { Ref, ref } from 'vue';
import { getCounterClient } from './CounterContractClient';
import { getFeedbackContractClient } from './FeedbackContractClient';

export type CreateClientArgs = {
  queryClient: QueryClient;
  walletClient: WalletClient<
    CustomTransport, // transport extends Transport = Transport,
    typeof anvil, // chain extends Chain | undefined = Chain | undefined,
    undefined, // account extends Account | undefined = Account | undefined,
    undefined // rpcSchema extends RpcSchema | undefined = undefined,
  >;
  publicClient: PublicClient;
  account: Ref<Address | null>;
};

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

  const account = ref<Address | null>(null);

  const accounts = useAsyncState(walletClient.getAddresses, [], {
    onSuccess: (data) => {
      account.value = data[0];
    },
  });

  return {
    counter: getCounterClient({
      queryClient,
      walletClient,
      publicClient,
      account,
    }),
    feedback: getFeedbackContractClient({
      queryClient,
      walletClient,
      publicClient,
      account,
    }),
    account,
    accounts,
  };
};
