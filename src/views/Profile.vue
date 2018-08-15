<template>
  <v-flex x12 class="profile">
    <profile/>
  </v-flex>
</template>

<script>
import Vue from 'vue'
// @ is an alias to /src
import Profile from '@/components/Profile.vue'

Vue.component('profile', Profile);

export default {
}
</script>
