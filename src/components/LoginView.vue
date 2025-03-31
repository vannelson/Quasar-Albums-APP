<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="email"
      label="Email *"
      hint="Enter your email"
      lazy-rules
      :rules="validationRules.email"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Password *"
      hint="Enter your password"
      lazy-rules
      :rules="validationRules.password"
    />

    <q-toggle v-model="rememberMe" label="Remember me" />

    <div>
      <q-btn label="Login" type="submit" color="primary" class="full-width" :loading="isLoading" />
    </div>
  </q-form>

  <q-card-section class="text-center">
    <q-btn flat color="primary" @click="$emit('switch-to-register')">
      Need an account? Register
    </q-btn>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { useValidation } from 'src/composables/useValidation';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);

const { validationRules } = useValidation(password);

const onSubmit = async () => {
  if (!email.value || !password.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Please fill in all required fields correctly',
    });
    return;
  }

  isLoading.value = true;

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (success) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Login successful',
    });
    await router.push('/sound-trip');
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: authStore.error || 'Invalid credentials',
    });
  }

  isLoading.value = false;
};
</script>
