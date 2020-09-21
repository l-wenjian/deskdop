import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { axios } from '@/libs/axios'
import { serveUrl } from '@/libs/config'
import ElementUI from 'element-ui'
import './styles/index.scss'

// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

Vue.prototype.$http = axios
Vue.prototype.$serveUrl = serveUrl

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
