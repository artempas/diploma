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
        this.$emit('auth-success', true)
      }
    }
  }
}
</script>

<template>

  <div class="auth-page">
    <div class="text-center">
      <div class="text">Вход</div>
    </div>
    <div class="form">
      <FloatLabel class="luboy">
      <label for="username" class="block text-900 font-medium mb-2">Имя пользователя</label>
      <InputText id="username" v-model="username" type="text" placeholder="Имя пользователя" class="w-full mb-3" />
      </FloatLabel>

      <FloatLabel class="luboy">
      <label for="password" class="block text-900 font-medium mb-2">Пароль</label>
      <InputText id="password" type="password" v-model="password" placeholder="Password" class="w-full mb-3" />
      </FloatLabel>
      <Button label="Войти" icon="pi pi-user" style="margin-bottom: 15px"></Button>
      <router-link to="/register">
      <Button label="Зарегистрироваться" severity="secondary"/>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

.auth-page{
  width: 100%;
  height: 200px;
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