<script setup lang="ts">
import { ref } from 'vue';
import { getClient } from 'src/client/contracts';
import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';

// Reaktive Variablen für UI

const $q = useQuasar();

const userFeedback = ref<string>('');
const client = getClient().feedback;
const identity = ref<Identity>(new Identity());

const createIdentity = () => {
  identity.value = new Identity();
  console.log(identity.value.export());
};
</script>

<template>
  <div>
    <div>
      <div>Private Key (base64): {{ identity.export() }}</div>
      <div>Public Key: {{ identity.publicKey[1].toString() }}</div>
      <div>Commitment: {{ identity.commitment.toString() }}</div>
      <q-btn @click="createIdentity">Create identity</q-btn>
    </div>

    <!-- Groups -->
    <div class="q-pa-md">
      <h4>Groups:</h4>
      <div v-if="(client.getUsers.data.value?.length ?? -1) < 1">
        No groups found
      </div>
      <div class="row">
        <q-card
          v-for="group in client.getUsers.data.value"
          :key="group.groupId"
          class="col"
        >
          <q-card-section>
            <div class="text-h6">
              {{ group.groupId }} ({{ group.members.length }})
            </div>
          </q-card-section>
          <q-card-section>
            <q-list bordered separator>
              <q-item v-for="user in group.members" :key="user">
                <q-item-section>{{ user }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- join new group card -->
        <q-card class="col">
          <q-card-section>
            <div class="text-h6">Neue Gruppe beitreten</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              @click="
                () => {
                  client.joinGroup.mutate({ groupId: 0, identity: identity });
                }
              "
              :loading="client.joinGroup.isPending.value"
            >
              Gruppe beitreten
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <pre>{{ JSON.stringify(client.getUsers.error.value, null, 2) }}</pre>
      <div>Loading: {{ client.getUsers.isLoading.value }}</div>
    </div>

    <!-- Feedback -->
    <div class="q-pa-md">
      <div class="text-h6">Feedback</div>
      <q-list bordered separator>
        <q-item v-for="(feedback, i) in client.getFeedback.data.value" :key="i">
          <q-item-section>{{ feedback }}</q-item-section>
        </q-item>
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
              @click="
                client.sendFeedback
                  .mutateAsync({
                    feedback: userFeedback,
                    _identity: identity,
                  })
                  .then(() => {
                    $q.notify({
                      message: 'Feedback gesendet',
                      color: 'positive',
                    });
                    userFeedback = '';
                  })
                  .catch((err) => {
                    $q.notify({ message: err.message, color: 'negative' });
                    console.error(err);
                  })
              "
              :loading="client.sendFeedback.isPending.value"
            >
              Feedback senden
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div>
        <div v-if="client.sendFeedback.isPending.value">Loading...</div>

        <!-- Error -->
        <div v-if="client.sendFeedback.error.value">
          <div>Send feedback error:</div>
          <div>{{ client.sendFeedback.error.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
