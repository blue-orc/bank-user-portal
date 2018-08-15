<template>
  <v-flex x12 class="home">
    <dashboard/>
  </v-flex>
</template>

<script>
// @ is an alias to /src
import Dashboard from '@/components/Dashboard.vue'

export default {
  name: 'home',
  components: {
    Dashboard
  }
}
</script>
