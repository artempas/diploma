import axios from "axios";

export async function apiRequest(method, url, data, toast){
    try{
        switch (method){
            case 'get':
                return (await axios.get(url)).data;
            case 'post':
                return (await axios.post(url, data)).data;
            case 'delete':
                return (await axios.delete(url, data)).data;
            default:
                return null;
        }
    } catch (e){
        toast.add({severity:"error", summary:'Ошибка', detail: e, life:3000})
        return {ok:false}
    }
}