import {GET_CLOSEST_BUS_STOPS} from '../actions/consts';

const defaultState = {
    closestBusStopsArray: null 
}

const closestBusStopsReducer = (state = defaultState, action) => {
    switch(action.type) {
    case GET_CLOSEST_BUS_STOPS:
        return Object.assign({}, state, {closestBusStopsArray: action.closestBusStopsArray})
    default:
        return state;
    }
}

export default closestBusStopsReducer