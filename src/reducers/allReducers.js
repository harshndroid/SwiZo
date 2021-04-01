import {combineReducers} from 'redux';
import user from './userReducer.js';
import restaurant from './restaurantReducer.js';
import menu from './menuReducer.js';

const appReducer = combineReducers({
    user, restaurant, menu
});


const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
