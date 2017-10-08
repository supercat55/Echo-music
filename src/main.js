import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
// import { Lazyload } from 'mint-ui'
import Mint from 'mint-ui'
import 'common/styles/index.css'
Vue.config.productionTip = false
Vue.use(Mint)
// Vue.use(Lazyload)
fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/img/loading.gif')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h=>h(App)
})
