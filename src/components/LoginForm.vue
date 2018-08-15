<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login to Bank of Oracle</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field v-model="password" id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                  <v-switch
                    :label="`Login as Administrator`"
                    v-model="isAdmin"
                  ></v-switch>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="signIn()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
    data: () => ({
        username: null,
        password: null,
        isAdmin: false
    }),
    methods:{
        signIn(){
            var user = {
                username: this.username,
                password: this.password,
                isAdmin: this.isAdmin
            }
            this.$store.dispatch('signIn', user);
            this.$router.push('/')
        }
    }
}
</script>

