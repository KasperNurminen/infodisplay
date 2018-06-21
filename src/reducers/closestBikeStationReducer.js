import {GET_CLOSEST_BIKE_STATION} from '../actions/consts';

const defaultState = {
    closestBikeStationArray: null 
}

const closestBikeStationReducer = (state = defaultState, action) => {
    switch(action.type) {
    case GET_CLOSEST_BIKE_STATION:
        return Object.assign({}, state, {closestBikeStationArray: action.closestBikeStationArray})
    default:
        return state;
    }
}

export default closestBikeStationReducer