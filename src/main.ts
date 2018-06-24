import Vue, {VNode} from 'vue';
import router from './router';
import App from './App.vue';

new Vue({
  el: '#app',
  router,
  render: h => <VNode>h(App)
});
