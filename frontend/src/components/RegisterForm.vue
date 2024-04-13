<script>
import axios from "axios";

export default {
  name: "RegisterForm",
  data(){
    return {
      username: '',
      password: '',
      errorMessage:''
    }
  },
  methods:{
    async register(){
      try{
        const response = await axios.post(`api/users/register`, {
          username: this.username,
          password: this.password
        })
        console.log(response)
        if (!response.data.ok){
          console.log('ОШИБКА ТУТ')
          this.errorMessage=response.data.error || 'Ошибка'
        } else {
          this.$emit('register-success', true)
        }
      } catch (e){
        console.log('ОШИБКА СЮТ')
        console.log(e)
        this.errorMessage= 'Ошибка'
      }
    }
  }
}
</script>

<template>

  <div class="auth-page">
    <div class="text-center">
      <div class="text">Регистрация</div>
    </div>
    <div class="form">
      <FloatLabel class="luboy">
        <label for="username" class="block text-900 font-medium mb-2">Имя пользователя</label>
        <InputText required id="username" v-model="username" type="text" placeholder="Имя пользователя" class="w-full mb-3" />
      </FloatLabel>

      <FloatLabel class="luboy">
        <label for="password" class="block text-900 font-medium mb-2">Пароль</label>
        <Password required id="password" weakLabel="Слабый" mediumLabel="Средний" strongLabel="СИЛЬНЫЙ" v-model="password" placeholder="Password" class="w-full mb-3" />
      </FloatLabel>
      <div class="p-error" style="margin-bottom:10px">{{errorMessage}}</div>
      <Button @click="register" label="Зарегистрироваться" icon="pi pi-user" style="margin-bottom: 15px"></Button>
      <router-link to="/login">
        <Button label="Войти" severity="secondary"/>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

.auth-page{
  width: 100%;
  height: 300px;
  display:flex;
  justify-content:space-around;
  align-items: center;
  flex-direction: column;
}
.luboy{
  margin-bottom:30px;
}

.form{
  display:flex;
  flex-direction: column;
}

.text{
  font-size: 50px;
  margin-bottom: 30px;
}

</style>