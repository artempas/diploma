import axios from "axios";

const instance = axios.create({baseURL: window.location.origin})
export async function apiRequest(method, url, data, toast){
    try{
        switch (method){
            case 'get':
                return (await instance.get(url)).data;
            case 'post':
                return (await instance.post(url, data)).data;
            case 'delete':
                return (await instance.delete(url, data)).data;
            case 'patch':
                return (await instance.patch(url, data)).data;
            default:
                return null;
        }
    } catch (e){
        console.log(e)
        toast.add({severity:"error", summary:'Ошибка', detail: e, life:3000})
        return {ok:false}
    }
}