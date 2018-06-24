import Vue from 'vue';
import VueRouter, {
  RouteConfig,
  RouterOptions
} from 'vue-router';

import Bookmarks from '../components/Bookmarks.vue';

Vue.use(VueRouter.install);

const routes = <RouteConfig[]>[
  {path: '', component: Bookmarks}
];

export default new VueRouter(<RouterOptions>{
  routes
});
