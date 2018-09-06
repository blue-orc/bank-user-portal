<template>
    <v-flex>
        <v-layout row wrap justify-center>
            <v-flex xs12>
                <v-card class="mx-3">
                    <v-card-media
                        :src="blockchainSrc"
                        height="200px"
                    ></v-card-media>
                    <v-layout justify-center>
                        <v-card class="ma-1" flat>
                            <v-card-text>
                                <v-layout row wrap justify-center>
                                    <v-flex xs12>
                                        <h1 class="text-xs-center">{{ transactions.length }}</h1>
                                    </v-flex>
                                    <v-flex xs12>
                                        <h3 class="text-xs-center">Total Transactions</h3>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-layout>
                    <transaction-list/>
                </v-card>
            </v-flex>    
        </v-layout>

    </v-flex>
</template>
<script>
import Vue from 'vue'

import TransactionList from '@/components/TransactionList'

Vue.component('transaction-list', TransactionList)

export default {
    data: () => {
        return {
            blockchainSrc: require('../assets/blockchain.jpg')
        }
    },
    computed:{
        transactions(){
            return this.$store.getters.transactions;
        }
    }
}
</script>
