<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useEvaluationStore } from 'src/stores/evaluationStore';

const store = useEvaluationStore();

// TODO: fetch the studenty struct identy from the chain

const router = useRouter();
const logout = () => {
  store.logout();
  router.push('/login');
};
</script>

<template>
  <div class="col-4 text-center">
    {{ store._identity?.commitment ?? 'not signed in' }}
  </div>
  <div class="col-4 text-right">
    <q-btn @click="logout" v-if="store.isLoggedIn">SignOut</q-btn>
    <q-btn @click="$router.push('/login')" v-else>LogIn</q-btn>
  </div>
</template>
