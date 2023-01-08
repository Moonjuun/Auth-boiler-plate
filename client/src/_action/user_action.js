import axios from 'axios'
import {
    Login_User
} from './type';
export function loginUser(dataToSubmit) {
    
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

        return {
            type: Login_User,
            payload: request

        }
}