import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'

import { mqttClient } from './common/mqtt-client'

Vue.config.productionTip = false

Vue.prototype.$mqttClient = mqttClient

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
