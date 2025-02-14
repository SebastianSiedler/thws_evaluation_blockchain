<script setup lang="ts">

const model = defineModel();

const fivePointLikeScale = [
  { label: 'trifft gar nicht zu', value: 1 },
  { label: 'trifft eher nicht zu', value: 2 },
  { label: 'trifft teilweise zu', value: 3 },
  { label: 'trifft eher zu', value: 4 },
  { label: 'trifft voll zu', value: 5 },
];
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-option-group
        :options="fivePointLikeScale"
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
