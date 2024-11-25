import { Identity } from '@semaphore-protocol/core';
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useEvaluationStore = defineStore('evaluation', () => {
  const _identity: Ref<Identity> = ref<Identity>(new Identity());

  return {
    _identity,
  };
});
