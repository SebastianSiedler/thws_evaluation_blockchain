import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'viem',
        component: () => import('pages/ViemPage.vue'),
      },
      {
        path: 'feedback',
        component: () => import('pages/FeedbackPage.vue'),
      },
      {
        path: 'evaluation',
        component: () => import('pages/EvaluationOverview.vue'),
      },
      {
        path: 'evaluation/:id',
        component: () => import('pages/EvaluationDetailPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
