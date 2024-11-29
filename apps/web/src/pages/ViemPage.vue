<script setup lang="ts">
import ViemCounterContract from 'src/components/ViemCounterContract.vue';

import { onErrorCaptured, ref } from 'vue';

const error = ref<Error | null>(null);

onErrorCaptured((e) => {
  error.value = e;
  console.log('error', e);
});
</script>

<template>
  <Suspense>
    <template #default>
      <ViemCounterContract />
    </template>
    <template #fallback>
      <q-spinner-gears />
    </template>
  </Suspense>
</template>
