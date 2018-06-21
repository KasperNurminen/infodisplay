import {combineReducers} from 'redux';
import locationReducer from './locationReducer';
import closestBusStopsReducer from './closestBusStopsReducer';
import closestBikeStationReducer from './closestBikeStationReducer';

export default combineReducers({
    location:locationReducer,
    closestBusStops: closestBusStopsReducer,
    closestBikeStation: closestBikeStationReducer
})