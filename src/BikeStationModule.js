import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import bus_stops from './assets/bus_stops.json'

class BikeStationModule extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            closest: null,
            distance: 0
        }
    }
    deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }
    getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // this.deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    getDistance = (coords, index, own_loc) => {

        var distance = this.getDistanceFromLatLonInKm(own_loc[0], own_loc[1], coords[0], coords[1])
        return [distance, index]
    }
    getClosestBikeStation = (location) => {
        var sorted = Object.values(bus_stops).map(x => this.getDistance([x.stop_lat, x.stop_lon], x.stop_code, location)).sort()
        var closest = sorted[0]
        this.setState({ "closest": bus_stops[closest[1]], distance: closest[0] })
    }
    componentWillReceiveProps(props) {
        console.log("received props")
        this.getClosestBikeStation(props.location)
    }


    render() {
        const { closest, distance } = this.state
        console.log("rendering...")

        if (closest) {
            return (
                <div>
                    <h3>Kaupunkipyörä-moduuli</h3>
                    <p>Sinua lähin pysäkki on  {closest.stop_name}. Se on  {Math.round(distance * 1000)} metrin etäisyyllä.</p>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h3>Ei sijaintia</h3>
                </div>
            );
        }

    }
}
BikeStationModule.propTypes = {
    location: PropTypes.array
};

export default BikeStationModule;
