import {createRouter, createWebHistory} from 'vue-router';
import Scenarios from "@/views/Scenarios.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ScenarioEditor from "@/views/ScenarioEditor.vue";

const routes = [
    {
        path: '/scenarios',
        name: 'scenarios',
        component: Scenarios
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/',
        redirect: {name: 'login'}
    },
    {
        path: '/scenarios/:id(\\d+)', component: ScenarioEditor
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const is_authenticated =  document.cookie.indexOf('AuthToken=')!==-1;
    console.log(to.path)
    if (authRequired && !is_authenticated) {
        console.log('redirecting to login')
        return '/login';
    }
    if (!authRequired && is_authenticated){
        console.log('redirecting logged')
        return '/scenarios'
    }
});

export default router;