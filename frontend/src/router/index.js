import {createRouter, createWebHistory} from 'vue-router';
import Scenarios from "@/views/Scenarios.vue";
import Login from "@/views/Login.vue";
import {useAuthStore} from "@/stores/auth";
import Register from "@/views/Register.vue";

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
    const auth = useAuthStore();
    console.log(to.path)
    if (authRequired && !auth.is_authenticated) {
        console.log('redirecting to login')
        auth.returnUrl = to.fullPath;
        return '/login';
    }
    if (!authRequired && auth.is_authenticated){
        console.log('redirecting logged')
        return '/scenarios'
    }
});

export default router;