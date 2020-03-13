import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import router from './router'
import store from './store'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import tooltipDirective from '@/directives/tooltip.directive'
import Paginate from 'vuejs-paginate'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'


import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'


Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)
Vue.directive('tooltip', tooltipDirective)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)

const firebaseConfig = {
    apiKey: "AIzaSyDlBYexekqDnfgwBxGeUyQXQsOZNwl0ZyE",
    authDomain: "newagent-ab187.firebaseapp.com",
    databaseURL: "https://newagent-ab187.firebaseio.com",
    projectId: "newagent-ab187",
    storageBucket: "newagent-ab187.appspot.com",
    messagingSenderId: "654875095103",
    appId: "1:654875095103:web:cbae0ad566a6532ba1c88a"
};

let app

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
})



