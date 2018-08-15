<template>
    <v-container>
        <h1>Welcome to Bank of Oracle!</h1>
        <v-carousel hide-delimiters>
            <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"

            >
                <div @click="navigate(item.path)">
                    <v-jumbotron dark >
                        <v-container fill-height>
                        </v-container>
                    </v-jumbotron>
                </div>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>
<script>
export default {
    data: () => ({
      drawer: null,
      items: [
          {
            src: require('../assets/bank.jpg'), path: 'history'
          },
          {
            src: require('../assets/loan.jpg'), path: 'loan'
          },
          {
            src: require('../assets/credit.jpg'), title: 'cards'
          }
        ]
    }),
    methods:{
        navigate(path){
            this.$router.push(path)
        }
    }
}
</script>
<style scoped>
img{
    width: 30px;
    height: 30px;
}
</style>

