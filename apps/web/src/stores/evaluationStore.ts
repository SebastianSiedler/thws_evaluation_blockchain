// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { evaluationContractPlatform } from '@acme/contracts/clients/ethers/evaluation';
import { Identity } from '@semaphore-protocol/core';
import { useAsyncState, useLocalStorage } from '@vueuse/core';
import { isAddress } from 'ethers';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { z } from 'zod';

export const AddressSchema = z.custom<string>(isAddress, 'Invalid eth Address');

export const useEvaluationStore = defineStore('evaluation', () => {
  const _identity = useLocalStorage<Identity | undefined>(
    'semaphore-identity-pk',
    undefined,
    {
      serializer: {
        read: (v) => {
          return v !== '' ? Identity.import(v) : undefined;
        },
        write: (v) => {
          return v instanceof Identity ? v.export() : '';
        },
      },
    },
  );

  const isLoggedIn = computed(() => !!_identity.value);

  const login = (identityPk: string) => {
    _identity.value = Identity.import(identityPk);
  };

  const logout = () => {
    console.log('signing out...');
    _identity.value = undefined;
  };

  // TODO: passt das mit den livecycle hooks? wird das unsubscribed?
  // oder sogar jedes mal neu subscribed, wenn der store genutzt wird?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.ethereum?.on('accountsChanged', (accounts) => {
    wallet.execute();
  });

  const wallet = useAsyncState(
    async () => {
      const eth_accounts = await window.ethereum?.request({
        method: 'eth_accounts',
      });
      return AddressSchema.array().parse(eth_accounts);
    },
    null,
    {
      throwError: true,
    },
  );

  return {
    _identity,
    isLoggedIn,
    login,
    logout,
    wallet,
  };
});
