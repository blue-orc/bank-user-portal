import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Documents from './views/Documents.vue'
import Cards from './views/Cards.vue'
import Transactions from './views/Transactions.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents
    },
    {
      path: '/document',
      name: 'document',
      component: Documents
    },
    {
      path: '/cards',
      name: 'cards',
      component: Cards
    },
    {
      path: '/history',
      name: 'history',
      component: Transactions
    }
  ]
})
