let INITIAL_STATE = {authorized: false}
const userInputReducer = function(state = INITIAL_STATE, action ) {

    switch (action.type) {
        case 'SIGNIN_USER':
            return {...state, authorized: action.payload};
        case 'SAVE_USER_KEY':
            return {...state, user_key: action.payload};
        case 'SAVE_USER_INFO':
            return {...state, user_id: action.payload.user_id, user_name: action.payload.user_name, user_phoneNumber: action.payload.user_phoneNumber, user_address: action.payload.user_address};
        case 'UPDATE_USER_INFO':
            let _state = {...state};
            _state['user_name'] = action.payload.name;
            _state['user_phoneNumber'] = action.payload.phone;
            _state['user_address'] = action.payload.address;
            return _state;
        default:
            return state;
    }
}


export default userInputReducer;