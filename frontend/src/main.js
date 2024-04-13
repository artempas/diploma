import { createApp } from 'vue'
import router from "@/router";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from "primevue/config";
import 'primevue/resources/themes/aura-light-cyan/theme.css';
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import App from "@/App.vue";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import 'primeicons/primeicons.css';
import DataView from 'primevue/dataview';
import Card from "primevue/card";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from "primevue/dialog";
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
export const app = createApp(App);
app.use(router).use(pinia).use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app');

app.component('Password', Password)
app.component('InputText', InputText)
app.component('InputGroup', InputGroup);
app.component('Button', Button);
app.component('FloatLabel',FloatLabel);
app.component('Card', Card)
app.component('ConfirmDialog',ConfirmDialog)
app.component('DataView', DataView)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
