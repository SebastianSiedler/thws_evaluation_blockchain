<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { getClient } from 'src/client/contracts';
import { ref } from 'vue';

const $q = useQuasar();
const client = getClient().feedback;

const props = defineProps<{
  identity: Identity;
  groupId: string;
}>();

const userFeedback = ref<string>('');

const feedbackQuery = client.getFeedback({ groupId: props.groupId });

const sendFeedback = () => {
  client.sendFeedback
    .mutateAsync({
      feedback: userFeedback.value,
      _identity: props.identity,
    })
    .then(() => {
      $q.notify({
        message: 'Feedback gesendet',
        color: 'positive',
      });
      userFeedback.value = '';
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
      console.error(err);
    });
};
</script>

<template>
  <q-list bordered separator style="height: 240px; overflow-y: auto">
    <q-item
      v-for="{ decodedMessage, nullifier } in feedbackQuery.data.value"
      :key="nullifier"
    >
      <q-item-section>{{ decodedMessage }}</q-item-section>
    </q-item>
  </q-list>
  <q-item>
    <q-item-section class="row">
      <q-input
        v-model="userFeedback"
        placeholder="Feedback eingeben"
        type="text"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        @click="sendFeedback"
        :loading="client.sendFeedback.isPending.value"
      >
        Feedback senden
      </q-btn>
    </q-item-section>
  </q-item>
</template>
