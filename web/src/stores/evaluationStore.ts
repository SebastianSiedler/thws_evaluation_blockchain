import { Identity } from '@semaphore-protocol/core';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useEvaluationStore = defineStore('evaluation', () => {
  const _identity = useLocalStorage<Identity>(
    'semaphore-identity-pk',
    new Identity(),
    {
      serializer: {
        read: (v) => Identity.import(v),
        write: (v) => v.export(),
      },
    },
  );

  return {
    _identity,
  };
});
