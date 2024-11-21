import { QueryClient, useQueryClient } from '@tanstack/vue-query';
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  CustomTransport,
  http,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
} from 'viem';
import { anvil } from 'viem/chains';
import { useAsyncState } from '@vueuse/core';
import { Ref, ref } from 'vue';
import { getCounterClient } from './CounterContractClient';
import { getFeedbackContractClient } from './FeedbackContractClient';
import { privateKeyToAccount } from 'viem/accounts';
import { SEMAPHORE_CONTRACT_ADDRESS } from './contracts/SemaphoreContract';
import { SemaphoreEthers } from '@semaphore-protocol/data';

export type CreateClientArgs = {
  queryClient: QueryClient;
  walletClient: WalletClient<
    CustomTransport, // transport extends Transport = Transport,
    typeof anvil, // chain extends Chain | undefined = Chain | undefined,
    undefined, // account extends Account | undefined = Account | undefined,
    undefined // rpcSchema extends RpcSchema | undefined = undefined,
  >;
  publicClient: PublicClient;

  publicServerClient: PublicClient;
  walletServerClient: WalletClient<
    HttpTransport,
    typeof anvil,
    PrivateKeyAccount,
    undefined
  >;
  semaphore: SemaphoreEthers;
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

  const ethNetworkProviderUrl = 'http://127.0.0.1:8545';
  const publicServerClient = createPublicClient({
    chain: anvil,
    transport: http(ethNetworkProviderUrl),
  });

  // Configure the signer
  const ethereumPrivateKey =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

  const walletServerClient = createWalletClient({
    chain: anvil,
    transport: http(ethNetworkProviderUrl),
    account: privateKeyToAccount(ethereumPrivateKey),
  });

  const account = ref<Address | null>(null);

  const accounts = useAsyncState(walletClient.getAddresses, [], {
    onSuccess: (data) => {
      account.value = data[0];
    },
  });

  const semaphore = new SemaphoreEthers(ethNetworkProviderUrl, {
    address: SEMAPHORE_CONTRACT_ADDRESS,
  });

  return {
    counter: getCounterClient({
      queryClient,
      walletClient,
      publicClient,
      account,
      walletServerClient,
      publicServerClient,
      semaphore,
    }),
    feedback: getFeedbackContractClient({
      queryClient,
      walletClient,
      publicClient,
      walletServerClient,
      publicServerClient,
      account,
      semaphore,
    }),
    account,
    accounts,
  };
};
