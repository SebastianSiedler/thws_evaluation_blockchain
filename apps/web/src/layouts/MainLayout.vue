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
      <div class="row">
        <q-toolbar>
          <div class="col-4">
            <q-toolbar-title
              @click="() => $router.push('/')"
              class="cursor-pointer"
            >
              THWS Evaluation
            </q-toolbar-title>
          </div>
          <IdentityAvatar />
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
