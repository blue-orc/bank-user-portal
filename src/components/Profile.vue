<template>
    <v-content>
        <v-btn @click="logout()">
            Logout
        </v-btn>
    </v-content>
</template>
<script>
export default {
    methods:{
        logout(){
            this.$store.dispatch('logout');
        }
    }
}
</script>
