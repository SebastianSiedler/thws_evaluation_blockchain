<script setup lang="ts">
import Viem from 'src/components/Viem.vue';
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
      <Viem />
    </template>
    <template #fallback>
      <q-spinner-gears />
    </template>
  </Suspense>
</template>
