import { GET_CLOSEST_BIKE_STATION} from './consts'

//5 closest bus stops
export const getClosestBikeStation = (closest) => {
    return {
        type: GET_CLOSEST_BIKE_STATION,
        closestBikeStationArray: closest
    }
}