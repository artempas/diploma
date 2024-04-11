import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', {
    state: ()=> {
        return {is_authenticated: document.cookie.indexOf('Auth=')!==-1, return_url: '/scenarios'}
    },
    persist: true
})