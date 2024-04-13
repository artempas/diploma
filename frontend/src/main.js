import { createApp } from 'vue'
import router from "@/router";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from "primevue/config";
import 'primevue/resources/themes/aura-dark-pink/theme.css';
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import App from "@/App.vue";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import 'primeicons/primeicons.css';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(router).use(pinia).use(PrimeVue).mount('#app')
app.component('Password', Password)
app.component('InputText', InputText)
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Button', Button);
app.component('FloatLabel',FloatLabel)