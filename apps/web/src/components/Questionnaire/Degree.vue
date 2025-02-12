<script setup lang="ts">
import { defineEmits } from 'vue';

const model = defineModel();

const fivePointHighToLow = [
  { label: 'Bachelor Digitale Gesellschaft', value: 0 },
  { label: 'Bachelor E-Commerce', value: 1 },
  { label: 'Bachelor Informatik', value: 2 },
  { label: 'Bachelor Informationssicherheit', value: 3 },
  { label: 'Bachelor Wirtschaftsinformatik', value: 4 },
  { label: 'Master Artificial Intelligence', value: 5 },
  { label: 'Master Digital Business Systems', value: 6 },
  { label: 'Anderer Studiengang', value: 7 },
];
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-option-group
        :options="fivePointHighToLow"
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
