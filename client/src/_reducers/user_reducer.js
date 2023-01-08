import {
    Login_User
} from '../_action/type'

export default function(state = {}, action) {
    switch(action.type) {
        case Login_User:
            return {...state, loginSuccess: action.payload}
            break;

            default:
                return state;
    }
}