<script setup lang="ts">
import { defineEmits } from 'vue';

const model = defineModel();

const degreeOptions = [
  { label: 'Bachelor Digitale Gesellschaft', value: 1 },
  { label: 'Bachelor E-Commerce', value: 2 },
  { label: 'Bachelor Informatik', value: 3 },
  { label: 'Bachelor Informationssicherheit', value: 4 },
  { label: 'Bachelor Wirtschaftsinformatik', value: 5 },
  { label: 'Master Artificial Intelligence', value: 6 },
  { label: 'Master Digital Business Systems', value: 7 },
  { label: 'Anderer Studiengang', value: 8 },
];
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-option-group
        :options="degreeOptions"
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
