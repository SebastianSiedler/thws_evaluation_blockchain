import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/evaluation',
      },
      {
        path: 'evaluation',
        component: () => import('pages/EvaluationOverview.vue'),
      },
      {
        path: 'evaluation/create',
        component: () => import('components/CreateEvaluation.vue'),
      },
      {
        path: 'evaluation/:id',
        component: () => import('pages/EvaluationDetailPage.vue'),
      },
      {
        path: 'login',
        component: () => import('pages/IdentityLoginPage.vue'),
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
