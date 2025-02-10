<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{ modelValue: number | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const rating = ref(props.modelValue);

const ratingOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const updateRating = (value: number | null) => {
  rating.value = value;
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="rating-scale">
    <div class="q-gutter-md">
      <q-radio
        v-for="option in ratingOptions"
        color="primary"
        bottom-label
        v-model="rating"
        :key="option.value ? option.value : 'null'"
        :val="option.value"
        :label="option.label"
        @update:modelValue="updateRating"
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
