const restaurantReducer = function(state={}, action){

    switch (action.type) {
        case 'SAVE_RESTAURANT_DETAIL':
            return action.payload;
        default:
            return state
    }
}

export default restaurantReducer;