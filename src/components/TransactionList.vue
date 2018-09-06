<template>
    <v-flex class="ma-2 pa-2">
        <v-expansion-panel v-for="(item, i) in orgNames" :key="i">
        <v-expansion-panel-content>
            <div slot="header">
            <v-list-tile
                :key="item"
                avatar
            >
                <v-list-tile-avatar>
                <v-icon>fas fa-university</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content >
                    <v-container fluid>
                        <v-layout row wrap justify-space-between>
                            <v-flex>
                                {{item}}
                            </v-flex>
                                <v-layout>
                                    <v-flex class="text-xs-right" align-center>
                                        <span>{{transactions.filter(x => x.orgName === item).length}}&nbsp;</span>
                                        <v-icon small>fas fa-receipt</v-icon>
                                    </v-flex>
                                </v-layout>
                        </v-layout>
                    </v-container>
                </v-list-tile-content>
            </v-list-tile>
            </div>

            <v-list-tile 
            avatar
            v-for="(txn,i) in transactions.filter(x => x.orgName === item).sort(function(a,b){return new Date(b.dateCreated) - new Date(a.dateCreated)})"
            :key="i"
            >
            <v-list-tile-avatar>
                <v-icon>fas fa-history</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-container fluid>
                <v-layout row wrap fill-width>
                <v-flex xs8>
                    <v-list-tile-title v-html="txn.transactionTypeText"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="convertDate(txn.dateCreated)"></v-list-tile-sub-title>
                </v-flex>
                <v-flex xs4 class="text-xs-right" v-if="txn.signatureData">
                    <!--<VueSignaturePad
                        :ref="txn.bankTransactionId.toString()"
                        :key="getSignaturePadRef(txn.bankTransactionId)"
                    />-->
                </v-flex>
                </v-layout>
                </v-container>
            </v-list-tile-content>
            </v-list-tile>
        </v-expansion-panel-content>
        </v-expansion-panel>
    </v-flex>
</template>
<script>
import Vue from 'vue'
import VueSignaturePad from 'vue-signature-pad'
import convertDate from '@/services/date-service'

Vue.use(VueSignaturePad)

export default {
    data: () => {
        return {
            convertDate: convertDate
        }
    },
    computed:{
        transactions(){
            var txns = this.$store.getters.transactions

            return txns;
        },
        orgNames(){
            var orgNames = []
            for(var transaction of this.transactions){
                var result = orgNames.find(x => x === transaction.orgName)
                if(!result){
                    orgNames.push(transaction.orgName);
                }
            }
            return orgNames;
        }
    },
    methods:{
        sortByDate(a, b){
            console.log(a)
            console.log(b)
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        },
        //getSignaturePadRef(id){
        //    console.log(id.toString())
        //    console.log(this.$refs)
        //    var txn = this.transactions.find(x => x.bankTransactionId === id)
        //    console.log(txn)
        //    if(txn){
        //        this.$refs[id.toString()].fromDataURL(txn.signatureData)
        //    }
        //    return  id
        //}
    }
}
</script>

