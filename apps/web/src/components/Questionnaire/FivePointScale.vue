<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{ modelValue: number | null }>();
const emit = defineEmits<{ (e: "update:modelValue", value: number | null): void }>();

const rating = ref(props.modelValue);

const ratingOptions = [
  { value: 1, label: '1 von 5 (immer)' },
  { value: 2, label: '2 von 5' },
  { value: 3, label: '3 von 5' },
  { value: 4, label: '4 von 5' },
  { value: 5, label: '5 von 5 (nie)' },
  { value: null, label: 'Nicht sinnvoll beantwortbar' },
];

const updateRating = (value: number | null) => {
  rating.value = value;
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="rating-scale">
    <label
      v-for="option in ratingOptions"
      :key="option.value ? option.value : 'null'"
      class="rating-option"
    >
      <input type="radio" :value="option.value" v-model="rating" @change="updateRating(option.value)" />
      {{ option.label }}
    </label>
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