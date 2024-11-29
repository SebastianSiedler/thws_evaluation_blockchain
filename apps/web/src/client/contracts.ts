import { SemaphoreEthers } from '@semaphore-protocol/data';
import { QueryClient, useQueryClient } from '@tanstack/vue-query';
import { useAsyncState } from '@vueuse/core';
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
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { Ref, ref } from 'vue';

import { SEMAPHORE_CONTRACT_ADDRESS } from './contracts/SemaphoreContract';
import { getEvaluationContractClient } from './EvaluationContractClient';

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

  if (!window.ethereum) {
    throw new Error('No ethereum provider found');
  }

  /**
   * Wallet client is used to write to contracts
   */
  const walletClient = createWalletClient({
    chain: anvil, // or mainnet if on mainnet
    transport: custom(window.ethereum!),
  });

  // Configure the signer
  const ethereumPrivateKey =
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

  const account = ref<Address | null>(null);
  account.value = privateKeyToAccount(ethereumPrivateKey).address;
  const accounts = useAsyncState(walletClient.getAddresses, [], {
    onSuccess: (data) => {
      // account.value = data[0];
    },
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
  const walletServerClient = createWalletClient({
    chain: anvil,
    transport: http(ethNetworkProviderUrl),
    // account: account.value,
  });

  const semaphore = new SemaphoreEthers(ethNetworkProviderUrl, {
    address: SEMAPHORE_CONTRACT_ADDRESS,
  });

  const createClientArgs = {
    queryClient,
    walletClient,
    publicClient,
    account,
    walletServerClient,
    publicServerClient,
    semaphore,
  };

  return {
    // counter: getCounterClient(createClientArgs),
    // feedback: getFeedbackContractClient(createClientArgs),
    evaluation: getEvaluationContractClient(createClientArgs),
    account,
    accounts,
  };
};
