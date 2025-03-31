import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn(`Access denied: ${to.path} requires authentication.`);
    next('/login');
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    console.warn(`Redirecting: ${to.path} is for guests only.`);
    next('/');
  } else {
    next();
  }
}
