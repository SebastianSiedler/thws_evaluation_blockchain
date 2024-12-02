<script setup lang="ts">
import IdentitySelector from 'src/components/IdentitySelector.vue';

// import { getClient } from 'src/client/contracts';

// const { account, accounts } = getClient();
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <!-- <div>
        <q-select
          v-model="account"
          :options="accounts.state.value"
          :loading="accounts.isLoading.value"
        />
      </div> -->
      <IdentitySelector />
      <q-toolbar>
        <q-toolbar-title>THWS Evaluation</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
