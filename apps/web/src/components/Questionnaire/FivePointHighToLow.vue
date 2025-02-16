<script setup lang="ts">
const model = defineModel();

const fivePointHighToLow = [
  { label: 'viel zu niedrig', value: 5 },
  { label: 'etwas zu niedrig', value: 4 },
  { label: 'genau richtig', value: 3 },
  { label: 'etwas zu hoch', value: 2 },
  { label: 'viel zu hoch', value: 1 },
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
