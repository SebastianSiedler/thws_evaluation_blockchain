<script setup lang="ts">
import { defineEmits } from 'vue';

const model = defineModel();

const fivePointTimeEstimate = [
  { label: '0 Stunden', value: 0 },
  { label: 'bis zu einer Stunde', value: 1 },
  { label: '1-2 Stunden', value: 2 },
  { label: '3-4 Stunden', value: 3 },
  { label: '5-6 Stunden', value: 5 },
  { label: 'mehr als 6 Stunden', value: 6 },
];
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-option-group
        :options="fivePointTimeEstimate"
        type="radio"
        v-model="model"
      />
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
