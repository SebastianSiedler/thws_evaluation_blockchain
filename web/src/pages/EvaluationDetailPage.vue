<script setup lang="ts">
import { useRoute } from 'vue-router';
import { z } from 'zod';

const route = useRoute();

const evaluationId = z.string().parse(route.params.id);
</script>

<template>
  <div>Evaluation Detail page {{ evaluationId }}</div>
</template>
