import { GET_LOCATION} from './consts'


//takes parameter [latitude, longitude]
export const getLocation = (loc) => {
    return {
        type: GET_LOCATION,
        userLocation: loc
    }
}
