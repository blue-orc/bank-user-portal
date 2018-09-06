<template>
    <v-card style="padding: 32px">
        <v-card-media
            :src="src"
            height="1600px"
        ></v-card-media>
        <v-card-text>
            Please sign
        </v-card-text>
        <v-card flat class="pt-1 pb-2 px-3 blue lighten-5" width="800" height="75">
            <VueSignaturePad
                ref="signaturePad"
                :customStyle="customStyle"
            />
        </v-card>
        <v-card-actions class="pt-3">
            <v-btn flat @click="save()">Save</v-btn>
            <v-btn flat @click="undo()">Undo</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import Vue from 'vue'
import VueSignaturePad from 'vue-signature-pad'

Vue.use(VueSignaturePad)
export default {
    data: () => ({
        src: require('../assets/creditCardAgreement.jpg'),
        customStyle: {
            'border-bottom': '1px solid black'
            
        },
        signatureData:''
    }),
    props:['document'],
    computed:{
        user: function (){
            return this.$store.getters['user']
        },
        bank: function (){
            return this.$store.getters['bank']
        },
        cards: function (){
            return this.$store.getters['cards']
        }
    },
    methods:{
        sign(){
            var transaction = {
                objectType: 'CardAgreement',
                objectId: this.document.relatedId,
                userId: this.user.username,
                dateCreated: (new Date).getTime(),
                transactionType: 2,
                orgName: this.bank.name,
                signatureData: this.signatureData
            }
            this.$store.dispatch('addTransaction', transaction);

            this.document.status = "Signed";
            this.$store.dispatch('setDocument', this.document);
            var card = this.cards.filter(x => x.id === this.document.relatedId)[0];
            card.status = "Agreement Signed";
            this.$store.dispatch('setCard', card);

            this.$router.push('/documents');
        },
        cancel(){
            this.$router.push('/documents')
        },
        undo() {
            this.$refs.signaturePad.undoSignature();
        },
        save() {
            const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

            if(isEmpty){
                alert('Please sign the document before saving!')
                return
            }

            this.signatureData = data;

            this.sign();
        }
    }
}
</script>
