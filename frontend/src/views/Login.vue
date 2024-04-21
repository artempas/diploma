
<script>
import AuthForm from "@/components/AuthForm.vue";


export default {
  name: "Login",
  components: {AuthForm},
  methods:{
    authenticated(successful) {
      if (successful){
        console.log('logged in')
        this.$router.push('/scenarios');
      }
    }
  },

}
</script>

<template>
    <AuthForm @auth-success="authenticated"></AuthForm>
</template>

<style scoped>

</style>