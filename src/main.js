import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/plugins/axios'
import '@/plugins/vee-validate'
import '@/assets/css/tailwind.css'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
