<template>
  <v-app id="inspire">
    <v-toolbar :color="color" dark fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><v-icon>fas fa-university</v-icon>&nbsp; {{bank.name}}</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items v-if="user.username">
        <v-btn flat @click="navigate('profile')">
          <span>{{user.username}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<v-icon>fas fa-user</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-flex v-if="user.username">
      <v-navigation-drawer
        v-model="drawer"
        fixed 
        clipped
        app
      >
        <v-list dense>
          <v-list-tile v-for="page in pages" @click="navigate(page.path)">
            <v-list-tile-action>
              <v-icon>{{page.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{page.title}} <span v-if="page.outstanding > 0">({{page.outstanding}})</span></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <v-container fluid fill-height fill-width>
          <v-layout
            justify-center
            align-center
          >
            <v-flex grow>
              <router-view/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-flex>
    <div v-if="!user.username">
      <LoginForm/>
    </div>
    <v-footer :color="color" app>
    </v-footer>
  </v-app>
</template>

<script>
  import Vue from 'vue'

  import LoginForm from './components/LoginForm'

  Vue.component('LoginForm', LoginForm);

  export default {
    data: () => ({
      drawer: null
    }),
    methods:{
      navigate(path){
        this.$router.push(path);
      }
    },
    computed: {
      color: function (){
        if(this.user.isAdmin){
          return "red"
        }
        return "indigo"
      },
      pages : function () {
        return [
          { title: 'Home', icon: 'home', path: '/'},
          { title: 'Credit Card', icon: 'far fa-credit-card', path: '/cards', outstanding: this.oustandingCards },
          //{ title: 'Loan', icon: 'fas fa-hand-holding-usd', path: '/loans'},
          { title: 'Documents', icon: 'fas fa-file-signature', path: '/documents', outstanding: this.oustandingDocuments},
          //{ title: 'History', icon: 'fas fa-history', path: '/history'}
        ]
      },
      user: function (){
        return this.$store.getters['user'];
      },
      bank: function (){
        return this.$store.getters['bank'];
      },
      oustandingCards: function (){
        if(this.user.isAdmin && this.$store.getters['cards'] && this.$store.getters['cards'].length > 0){
          return this.$store.getters['cards'].filter(x=>x.status==="Applied").length
        }
      },
      oustandingDocuments: function (){
        if(this.$store.getters['documents'] && this.$store.getters['documents'].length > 0){
          if(this.user.isAdmin){
            return this.$store.getters['documents'].filter(x => x.status === "Signed").length;
          }
          else{
            return this.$store.getters['documents'].filter(x => x.status === "Unsigned").length
          }
        }
      }
    },
    created(){
      var bank = {
        name: 'Bank of Oracle'
      }
      this.$store.dispatch('initBank', bank);
    },
    props: {
      source: String
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

span{
  font-size:16px;
}
</style>
