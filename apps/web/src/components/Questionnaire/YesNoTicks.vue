<script setup lang="ts">
const model = defineModel();

const yesNoOptions = [
  { value: true, label: 'Ja' },
  { value: false, label: 'Nein' },
];
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-option-group :options="yesNoOptions" type="radio" v-model="model" />
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
