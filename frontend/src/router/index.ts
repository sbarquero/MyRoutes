import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: () => import('../views/ConfigurationView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: {
        requiresAuth: true,
        authorizedRol: 'admin',
      },
    },
    {
      path: '/tracks',
      name: 'tracks',
      component: () => import('../views/TrackView.vue'),
      meta: {
        requiresAuth: true,
        authorizedRol: 'user',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: () => import('../views/ResetView.vue'),
    },
    {
      path: '/activate-user/:token',
      name: 'activate-user',
      component: () => import('../views/ActivateView.vue'),
    },
    {
      path: '/not-authorized',
      name: 'not-authorized',
      component: () => import('../views/NotAuthorizedView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach(async to => {
  const auth = useAuthStore();

  // Refresh token if exist refreshToken
  if (sessionStorage.getItem('refreshToken')) {
    const result = await auth.refresh();
    if (!result?.ok) {
      console.error(result?.message);
    }
  }

  // Check authorization
  if (to.meta.requiresAuth) {
    if (auth.rol != 'admin' && to.meta.authorizedRol !== auth.rol) {
      return { name: 'not-authorized' };
    }
  }
});

export default router;
