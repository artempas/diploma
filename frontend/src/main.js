import { createApp } from 'vue'
import router from "@/router";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from "primevue/config";
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
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import {Panel, VueFlow} from "@vue-flow/core";
import {Background} from "@vue-flow/background";
import Textarea from "primevue/textarea";
import Chip from "primevue/chip";
import Tooltip from "primevue/tooltip";
import '@/vue-flow-styles.css';
import 'primevue/resources/themes/aura-light-noir/theme.css'
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";
import Badge from "primevue/badge";
import BadgeDirective from 'primevue/badgedirective';
import ConfirmPopup from "primevue/confirmpopup";



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
export const app = createApp(App);
app.use(router).use(pinia).use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app');

app.directive('badge', BadgeDirective);

app.component('ConfirmPopup', ConfirmPopup)
app.component('Password', Password)
app.component('InputText', InputText)
app.component('InputGroup', InputGroup);
app.component('Button', Button);
app.component('FloatLabel',FloatLabel);
app.component('Card', Card)
app.component('ConfirmDialog',ConfirmDialog)
app.component('DataView', DataView)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('Toast', Toast)
app.component('Chip', Chip)
app.component('Background', Background)
app.component('VueFlow', VueFlow)
app.component("Panel", Panel)
app.directive('tooltip', Tooltip);
app.component('SelectButton',SelectButton)
app.component('ToggleButton',ToggleButton)
app.component('Badge', Badge)


