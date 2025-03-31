import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/AuthPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/sound-trip',
      },
      {
        path: 'sound-trip',
        component: () => import('pages/SoundTripPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'albums',
        component: () => import('pages/AlbumsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'songs',
        component: () => import('pages/SongsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
