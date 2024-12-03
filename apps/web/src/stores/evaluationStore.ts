import { Identity } from '@semaphore-protocol/core';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';

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

  return {
    _identity,
    isLoggedIn,
    login,
    logout,
  };
});
