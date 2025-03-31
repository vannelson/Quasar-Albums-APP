import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { authGuard } from './guard';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard); // Apply authentication guard

export default router;
