import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import { mqttClient } from './common/mqtt-client'

Vue.config.productionTip = false

Vue.prototype.$mqttClient = mqttClient

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
