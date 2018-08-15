<template>
    <v-card>
        {{document.status}}
    </v-card>
</template>
<script>
export default {
    props:['document'],
    data () {
        return {
        }
    },
    computed:{
        documents: function(){
            return this.$store.getters['documents'];
        }
    },
    methods:{
        navigate(path){
            this.$router.push(path);
        }
    }
}
</script>
