import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', {
    state: ()=> {
        return {token: '', return_url: '/scenarios'}
    },
    persist: true
})