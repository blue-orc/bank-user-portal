<template>
    <div>
        <v-card style="margin: 32px">
            <v-card-media
                :src="cardImageSrc"
                height="200px"
            ></v-card-media>
            <v-card-title primary-title>
                <div>
                    <h3 class="headline mb-0">Credit Card Application</h3>
                    <br/>
                    <div>Applicant: {{card.userId}}</div>
                    <br/>
                    <div>Current Status: {{card.status}}</div>
                </div>
            </v-card-title>
            <v-card-actions v-if="user.isAdmin">
                <v-btn flat v-if="card.status === 'Applied'" @click="sendAgreement()">Send Agreement</v-btn>
                <v-btn flat v-if="card.status === 'Agreement Signed'" @click="approve()">Approve</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
export default {
    data: () => ({
        cardImageSrc: require('../assets/genericCard.jpg')
    }),
    props:['card'],
    computed:{
        user: function (){
            return this.$store.getters['user'];
        },
        bank: function (){
            return this.$store.getters['bank'];
        }
    },
    methods:{
        sendAgreement(){
            var transaction = {
                objectType: 'CardAgreement',
                objectId: this.card.id,
                userId: this.user.username,
                dateCreated: (new Date).getTime(),
                transactionType: 10,
                orgName: this.bank.name
            }

            this.$store.dispatch('addTransaction', transaction);

            var document = {
                userId: this.card.userId,
                type: "Agreement",
                status: "Unsigned",
                service: "Card",
                relatedId: this.card.id
            }

            this.$store.dispatch('setDocument', document);

            var card = this.$store.getters['cards'].filter(x => x.id === this.card.id)[0];
            card.status = "Agreement Sent";

            this.$store.dispatch('setCard', card);
        },
        approve(){
            var transaction = {
                objectType: 'CardAgreement',
                objectId: this.card.id,
                userId: this.user.username,
                dateCreated: (new Date).getTime(),
                transactionType: 11,
                orgName: this.bank.name
            }
            
            this.$store.dispatch('addTransaction', transaction);

            var document = this.$store.getters['documents'].filter(x => x.relatedId === this.card.id)[0];
            document.status = "Approved";

            this.$store.dispatch('setDocument', document);

            var card = this.$store.getters['cards'].filter(x => x.id === this.card.id)[0];
            card.status = "Active";

            this.$store.dispatch('setCard', card);
        }
    }
}
</script>
