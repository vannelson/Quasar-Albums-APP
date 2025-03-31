<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="name"
      label="Full Name *"
      hint="Enter your full name"
      lazy-rules
      :rules="validationRules.name"
    />

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

    <q-input
      filled
      type="password"
      v-model="passwordConfirmation"
      label="Confirm Password *"
      hint="Re-enter your password"
      lazy-rules
      :rules="validationRules.passwordConfirmation"
    />

    <div>
      <q-btn
        label="Register"
        type="submit"
        color="primary"
        class="full-width"
        :loading="isLoading"
      />
    </div>
  </q-form>

  <q-card-section class="text-center">
    <q-btn flat color="primary" @click="$emit('switch-to-login')">
      Already have an account? Login
    </q-btn>
  </q-card-section>

  <q-card-section class="text-caption text-center text-grey">
    This registration is for your account consideration. Please contact administration for approval.
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { useValidation } from 'src/composables/useValidation';

const $q = useQuasar();
const authStore = useAuthStore();

const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const passwordConfirmation = ref<string>('');
const isLoading = ref<boolean>(false);

const { validationRules } = useValidation(password);

const onSubmit = async () => {
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    password.value !== passwordConfirmation.value
  ) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Please fill in all required fields correctly',
    });
    return;
  }

  isLoading.value = true;

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  });

  if (success) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Registration successful',
    });
    name.value = '';
    email.value = '';
    password.value = '';
    passwordConfirmation.value = '';
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: authStore.error || 'An error occurred',
    });
  }

  isLoading.value = false;
};
</script>
