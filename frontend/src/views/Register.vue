
<script>
import {useAuthStore} from "@/stores/auth";
import {mapWritableState} from "pinia";
import AuthForm from "@/components/AuthForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";


export default {
  name: "Login",
  components: {RegisterForm, AuthForm},
  methods:{
    registered(successful) {
      if (successful){
        this.$router.push( this.return_url);
        this.is_authenticated=true;
      }
    }
  },
  computed:{
    ...mapWritableState(useAuthStore, ['return_url', "is_authenticated"])
  }
}
</script>

<template>
  <RegisterForm @register-success="registered"></RegisterForm>
</template>

<style scoped>

</style>