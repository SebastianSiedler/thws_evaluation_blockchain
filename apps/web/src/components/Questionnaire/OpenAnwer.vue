<script setup lang="ts">
import { defineEmits } from 'vue';

const model = defineModel();
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-editor v-model="model as string"/>
    </div>
  </div>
</template>

<style scoped>
.rating-scale {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rating-option {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
