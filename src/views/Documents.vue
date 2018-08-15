<template>
  <v-flex xs12 class="documents">
    <v-flex v-if="path === '/documents'">
          <v-expansion-panel v-for="(item, i) in documents" :key="i" style="margin-top:32px; margin-bottom:32px; padding-top:16px; padding-bottom:16px">
            <v-expansion-panel-content>
              <div slot="header">
                <v-list-tile
                  :key="item.title"
                  avatar
                  @click="select(i)"
                >
                  <v-list-tile-avatar>
                    <v-icon>fas fa-file-alt</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.type"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.status"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </div>

              <v-list-tile 
                avatar
                v-for="(txn,i) in transactions.filter(x => x.objectId === item.relatedId)"
                :key="i"
              >
                <v-list-tile-avatar>
                  <v-icon>fas fa-history</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="txn.transactionTypeText"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="convertDate(txn.dateCreated)"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-expansion-panel-content>
          </v-expansion-panel>
    </v-flex>
    <v-flex v-if="path === '/document'">
      <document :document="documents[selectedIndex]"/>
    </v-flex>
  </v-flex>
</template>

<script>
import Vue from 'vue'
import convertTransactionType from '@/services/transactionType-service'
import convertDate from '@/services/date-service'

// @ is an alias to /src
import DocumentTile from '@/components/DocumentTile.vue'
import Doc from '@/components/Document.vue'

Vue.component('document-tile', DocumentTile);
Vue.component('document', Doc);


export default {
  data: () => ({
    selectedIndex: -1,
    convertDate: convertDate
  }),
  computed:{
    documents: function (){
      return this.$store.getters['documents'];
    },
    path: function(){
      return this.$route.path;
    },
    user: function(){
      return this.$store.getters['user']
    },
    transactions: function (){
        var transactions = this.$store.getters['transactions'];
        for(var i = 0; i < transactions.length; i++){
          transactions[i].transactionTypeText = convertTransactionType(transactions[i].transactionType)
          if(transactions[i].transactionType >= 10 && transactions[i].transactionType < 20){
              transactions[i].group = 'Credit Card'
          }
        }
        return transactions;
    }
  },
  methods:{
    select(i){
      this.selectedIndex = i;
      this.$router.push('document')
    }
  }
}
</script>
