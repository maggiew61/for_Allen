import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import future from '@/components/future'

// vue rangedate Datepicker
import VueRangedatePicker from 'vue-rangedate-picker'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-rangedate-picker/dist/vue-rangedate-picker.css'
Vue.use(VueRangedatePicker)
// range date ends

// moment
import moment from "moment";
import VueMomentJS from "vue-momentjs";
Vue.use(VueMomentJS, moment);  //use就是放在global的區域 vue都可用


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'future',
      component: future
    }
  ]
})
