<script setup lang="ts">
import FeedbackList from 'src/components/Feedback/FeedbackList.vue';

import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { Ref, ref } from 'vue';

import { getClient } from 'src/client/contracts';

// Reaktive Variablen für UI

const $q = useQuasar();

const client = getClient().feedback;
const identity: Ref<Identity> = ref<Identity>(new Identity());

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
            <q-list bordered separator style="height: 240px; overflow-y: auto">
              <q-item v-for="user in group.members" :key="user">
                <q-item-section
                  style="display: flex; flex-direction: row; flex-wrap: wrap"
                >
                  <div style="min-width: 0">
                    <div
                      style="
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      <span v-if="user == identity.commitment.toString()">
                        (You)
                      </span>
                      <span> {{ user }}</span>
                    </div>
                  </div>
                </q-item-section>
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
                  client.joinGroup.mutate({ groupId: '0', identity: identity });
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
      <FeedbackList :identity="identity" groupId="0" />

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
