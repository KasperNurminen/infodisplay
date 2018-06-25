import { GET_CLOSEST_BUS_STOPS} from './consts'

//5 closest bus stops
export const getClosestBusStops = (closest) => {
    return {
        type: GET_CLOSEST_BUS_STOPS,
        closestBusStopsArray: closest
    }
}