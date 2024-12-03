<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useEvaluationStore } from 'src/stores/evaluationStore';

const store = useEvaluationStore();
const router = useRouter();

const identityPk = ref<string>('');

const login = () => {
  store.login(identityPk.value);
  router.push('/');
};
</script>

<template>
  <q-page>
    <q-page-container>
      <div class="q-pa-md">
        <h1 class="text-h4">Identity Login</h1>

        <q-input v-model="identityPk" label="Identity Private Key" />
        <q-btn @click="login">LogIn</q-btn>
      </div>
    </q-page-container>
  </q-page>
</template>
