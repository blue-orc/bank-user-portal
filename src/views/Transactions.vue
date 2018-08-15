<template>
    <v-flex>
        <v-expansion-panel>
            <v-expansion-panel-content>
            <div slot="header">Credit Card</div>
            <v-card
                v-for="(txn,i) in transactions.filter(x => x.group ==='Credit Card')"
                :key="i"
            >
                <v-card-text>{{ txn.transactionTypeText }}</v-card-text>
            </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-flex>
</template>
<script>
import convertTransactionType from '@/services/transactionType-service'

export default {
    computed:{
        user: function (){
            return this.$store.getters['user'];
        },
        transactions: function (){
            var transactions = this.$store.getters['transactions'].filter(x => x.userId === this.user.username)
            for(var i = 0; i < transactions.length; i++){
                if(!transactions[i].transactionType){
                    transactions[i].transactionTypeText = 'false'
                }
                else{
                transactions[i].transactionTypeText = convertTransactionType(transactions[i].transactionType)
                }

                if(transactions[i].transactionType >= 10 && transactions[i].transactionType < 20){
                    transactions[i].group = 'Credit Card'
                }
            }
            return transactions;
        }
    }
}
</script>
