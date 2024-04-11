
<script>
import {useAuthStore} from "@/stores/auth";
import {mapWritableState} from "pinia";
import AuthForm from "@/components/AuthForm.vue";


export default {
  name: "Login",
  components: {AuthForm},
  methods:{
    authenticated(successful) {
      if (successful){
        console.log('logged in')
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
  <AuthForm @auth-success="authenticated"></AuthForm>
</template>

<style scoped>

</style>