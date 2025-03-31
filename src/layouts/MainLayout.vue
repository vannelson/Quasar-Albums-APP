<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-h6">Soundify</q-toolbar-title>

        <q-btn flat round dense icon="logout" @click="logout" class="q-mr-sm">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-tabs align="center" class="bg-dark text-white">
        <q-route-tab to="/sound-trip" label="Sound Trip" icon="headset" />
        <q-route-tab to="/albums" label="Albums" icon="album" />
        <q-route-tab to="/songs" label="Songs" icon="music_note" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  authStore.logout();
  await router.push('/login');
};
</script>

<style lang="scss">
.bg-primary {
  background-color: #43766c !important;
}

.bg-dark {
  background-color: #222 !important;
}
</style>
