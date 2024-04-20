<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Password from "primevue/password";

export default {
  name: "AuthForm",
  components:{FloatLabel, Password, InputText},
  data(){
    return {
      username: '',
      password: '',
      errorMessage:''
    }
  },
  methods:{
    async auth(){
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
    <div class="text">Вход</div>
    <div class="form">
      <FloatLabel class="luboy">
        <label for="username">Имя пользователя</label>
        <InputText id="username" v-model="username" type="text" placeholder="Имя пользователя" />
      </FloatLabel>

      <FloatLabel class="luboy" id="passwordG">
        <label for="password" style="z-index:100">Пароль</label>
        <Password :feedback="false" id="password" v-model="password" placeholder="Пароль" />
      </FloatLabel>
      <Button label="Войти" icon="pi pi-user" style="margin-bottom: 15px" @click="auth"></Button>
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
  display:flex;
  margin-bottom:30px;
  width:300px;
}


.form{
  align-items: center;
  display:flex;
  flex-direction: column;
}

.text{
  font-size: 50px;
  margin-bottom: 30px;
}

</style>