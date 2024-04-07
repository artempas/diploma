
<script>
import {useAuthStore} from "@/stores/auth";
import {mapWritableState} from "pinia";
import AuthForm from "@/components/AuthForm.vue";
import axios from "axios";


export default {
  name: "Login",
  components: {AuthForm},
  methods:{
    authenticated(token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      this.token=token
      console.log(this.return_url)
      this.$router.push( this.return_url);
    }
  },
  computed:{
    ...mapWritableState(useAuthStore, ['return_url', "token"])
  }
}
</script>

<template>
  <AuthForm @auth-success="authenticated"></AuthForm>
</template>

<style scoped>

</style>