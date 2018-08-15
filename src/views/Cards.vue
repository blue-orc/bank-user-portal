<template>
  <v-flex xs12 class="cards">
    
    <div v-if="user.isAdmin">
      <v-flex v-if="path === '/cards'">
        <div v-for="(card, i) in cards">
          <card-tile :card="card" @click="selectCard(i)"/>
        </div>
      </v-flex>
    </div>

    <div v-else>
      <v-btn @click="addCard()">
        Apply for Card
      </v-btn>
      <v-flex v-if="path === '/cards'">
        <div v-for="(card, i) in cards">
          <card-tile :card="card" @click="selectCard(i)"/>
        </div>
      </v-flex>
      <v-flex v-if="path === '/card'">
        <card/>
      </v-flex>
    </div>
  </v-flex>
</template>

<script>
import Vue from 'vue'
// @ is an alias to /src
import CardTile from '@/components/CardTile.vue'
import Card from '@/components/Card.vue'

Vue.component('card', Card);
Vue.component('card-tile', CardTile);


export default {
  data: () => ({
    cardIndex: -1
  }),
  computed:{
    path: function(){
      return this.$route.path;
    },
    cards: function (){
      return this.$store.getters['cards']
    },
    user: function (){
      return this.$store.getters['user']
    },
    bank: function (){
      return this.$store.getters['bank']
    }
  },
  methods: {
    selectCard(index){
      this.cardIndex = index;
      this.$router.push('card');
    },
    addCard(){
      var card ={
        userId: this.user.username,
        status: "Applied",
        id: (new Date).getTime()
      }

      var transaction = {
        objectType: 'Card',
        objectId: card.id,
        userId: this.user.username,
        dateCreated: (new Date).getTime(),
        transactionType: 0,
        createdBy: this.user.username,
        orgName: this.bank.name
      }

      this.$store.dispatch('addTransaction', transaction);


      this.$store.dispatch('setCard', card);
    }
  }
}
</script>
