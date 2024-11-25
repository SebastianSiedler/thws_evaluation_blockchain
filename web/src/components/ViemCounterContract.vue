<script setup lang="ts">
import { useQuasar } from 'quasar';
import { getClient } from 'src/client/contracts';
import { ref } from 'vue';

const $q = useQuasar();
const client = getClient().counter;

const newNumber = ref(0);
</script>

<template>
  <q-page class="q-pa-sm">
    <h1 class="text-h6">Counter View</h1>
    <div v-if="client.getNumberQuery.isPending.value">Loading...</div>
    <div>Aktuelle Zahl: {{ client.getNumberQuery.data.value }}</div>
    <pre>{{ client.getNumberQuery.error.value }}</pre>
    <div>
      <q-input
        v-model.number="newNumber"
        type="number"
        placeholder="Neue Zahl"
        style="width: 200px"
      />
    </div>

    <!-- Set Number -->
    <q-btn
      @click="
        client.setNumberMutation.mutate(BigInt(newNumber), {
          onError: (error) => {
            $q.notify({ message: error.message, color: 'negative' });
          },
          onSuccess: () => {
            $q.notify({ message: 'Number set', color: 'positive' });
          },
        })
      "
      :loading="client.setNumberMutation.isPending.value"
    >
      Set Number
    </q-btn>
    <pre>{{ client.setNumberMutation.error.value }}</pre>

    <!-- Increment -->
    <q-btn
      @click="
        client.incrementNumberMutation.mutate(undefined, {
          onError: (error) => {
            $q.notify({ message: error.message, color: 'negative' });
          },
          onSuccess: () => {
            $q.notify({ message: 'Number incremented', color: 'positive' });
          },
        })
      "
      :loading="client.incrementNumberMutation.isPending.value"
    >
      Increment
    </q-btn>

    <pre>{{ client.incrementNumberMutation.error.value }}</pre>
  </q-page>
</template>
