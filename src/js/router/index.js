import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import platform from '@/components/platform';


Vue.use(Router);
Vue.use(VueAxios, axios);

const router = new Router({
  base: '',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'platform',
      component: platform,
    },
  ],
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
