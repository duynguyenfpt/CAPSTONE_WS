import Vue from 'vue'
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/transfer.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/steps.css'
import 'element-ui/lib/theme-chalk/step.css'

Vue.component('ElTransfer', () => import('element-ui/lib/transfer'))
Vue.component('ElSelect', () => import('element-ui/lib/select'))
Vue.component('ElOption', () => import('element-ui/lib/option'))
Vue.component('ElSteps', () => import('element-ui/lib/steps'))
Vue.component('ElStep', () => import('element-ui/lib/step'))
