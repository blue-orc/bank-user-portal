<template>
    <v-card style="padding: 32px">
        <v-card-media
            :src="src"
            height="1600px"
        ></v-card-media>
        <v-card-actions>
            <v-btn flat @click="sign()">Sign</v-btn>
            <v-btn flat @click="cancel()">cancel</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data: () => ({
        src: require('../assets/creditCardAgreement.jpg')
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
                orgName: this.bank.name
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
        }
    }
}
</script>
