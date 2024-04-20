
<script>
import AuthForm from "@/components/AuthForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";


export default {
  name: "Login",
  components: {RegisterForm, AuthForm},
  methods:{
    registered(successful) {
      if (successful){
        this.$router.push('/');
      }
    }
  },

}
</script>

<template>
  <RegisterForm @register-success="registered"></RegisterForm>
</template>

<style scoped>

</style>