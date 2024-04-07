<script>
import axios from "axios";

export default {
  name: "AuthForm",
  data(){
    return {
      username: '',
      password: '',
      errorMessage:''
    }
  },
  methods:{
    async onSubmit(e){
      e.preventDefault()
      const response = await axios.post(`api/users/auth`, {
        username: this.username,
        password: this.password
      })
      if (!response.data.ok){
        this.errorMessage=response.data.error || 'Ошибка'
      } else {
        this.$emit('auth-success', response.data.token)
      }
    }
  }
}
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="username" type="text" name="username" placeholder="Имя пользователя" required/>
    <input v-model="password" type="password" name="password" placeholder="Пароль" required/>
    {{errorMessage}}
    <input type="submit">
  </form>
</template>

<style scoped>

</style>