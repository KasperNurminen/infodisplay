import {GET_LOCATION} from '../actions/consts';

const defaultState = {
    userLocation: null,
}

const locationReducer = (state = defaultState, action) => {
    switch(action.type) {
    case GET_LOCATION:
        return Object.assign({}, state, {userLocation: action.userLocation});
    default:
        return state;
    }
}

export default locationReducer