<script setup lang="ts">
import IdentityAvatar from 'src/components/IdentityAvatar.vue';
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
      <!-- <IdentitySelector /> -->
      <q-toolbar>
        <q-toolbar-title
          @click="() => $router.push('/')"
          class="cursor-pointer"
        >
          THWS Evaluation
        </q-toolbar-title>
        <IdentityAvatar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
