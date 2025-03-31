import type { Ref } from 'vue';

export function useValidation(password?: Ref<string>) {
  return {
    validationRules: {
      name: [(val: string) => !!val || 'Please enter your name'],
      email: [(val: string) => !!val || 'Please enter your email'],
      password: [(val: string) => !!val || 'Please enter your password'],
      passwordConfirmation: [(val: string) => val === password?.value || 'Passwords must match'],
    },
  };
}
