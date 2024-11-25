<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';
import { storeToRefs } from 'pinia';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const store = useEvaluationStore();
const { _identity } = storeToRefs(store);

const createIdentity = () => {
  _identity.value = new Identity();
  console.log({ _identity });
};
</script>

<template>
  <div>
    <div>Private Key (base64): {{ _identity.export() }}</div>
    <div>Public Key: {{ _identity.publicKey[1].toString() }}</div>
    <div>Commitment: {{ _identity.commitment.toString() }}</div>
    <q-btn @click="createIdentity">Create identity</q-btn>
  </div>
</template>
