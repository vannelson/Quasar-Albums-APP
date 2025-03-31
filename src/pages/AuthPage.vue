<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-lg shadow-3 auth-card">
          <q-card-section class="text-center">
            <div class="text-h6 q-mt-md">
              {{ isRegister ? 'Create an Account' : 'Welcome Back' }}
            </div>
          </q-card-section>

          <q-card-section>
            <Login v-if="!isRegister" @switch-to-register="toggleAuthMode" />
            <Register v-else @switch-to-login="toggleAuthMode" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Login from '../components/LoginView.vue';
import Register from '../components/RegisterView.vue';

const isRegister = ref<boolean>(false);

const toggleAuthMode = () => {
  isRegister.value = !isRegister.value;
};
</script>

<style scoped>
.q-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background:
    linear-gradient(rgba(67, 118, 108, 0.8), rgba(90, 156, 141, 0.8)),
    url('../assets/image/loginbackground.jpeg');
  background-size: cover;
  background-position: center;
}

.auth-card {
  width: 400px;
  border-radius: 12px;
  text-align: center;
  background: white;
}
</style>
