export function userAuthorized(data) {
    return{
        type: 'SIGNIN_USER',
        payload: data
    }
}

export function saveUserInfo(data) {
    return{
        type: 'SAVE_USER_INFO',
        payload: data
    }
}

export function saveUserKey(data) {
    return{
        type: 'SAVE_USER_KEY',
        payload: data
    }
}

export function updateUserInfo(data) {
    return{
        type: 'UPDATE_USER_INFO',
        payload: data
    }
}