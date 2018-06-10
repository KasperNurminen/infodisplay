import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';


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
        return fetch('https://data.foli.fi/citybike', { mode: 'cors' })
            .then(function (response) {
                console.log(response.headers)
                return response.json();
            })
            .then(function (citybike_stops) {
                var sorted = Object.values(citybike_stops['racks']).map(x => this.getDistance([x.lat, x.lon], x.id, location)).sort()
                var closest_with_bikes
                let i = -1
                do {
                    i++
                    closest_with_bikes = Object.values(citybike_stops['racks']).find(x => x.id === sorted[i][1])
                } while (closest_with_bikes.bikesAvailable === 0)
                return [closest_with_bikes, sorted[i][0]]

            }.bind(this))


    }
    componentWillReceiveProps(props) {
        this.getClosestBikeStation(props.location)
            .then(closest_and_distance => {

                this.setState({ closest: closest_and_distance[0], distance: closest_and_distance[1] })
            })


    }

    render() {
        const { closest, distance } = this.state
        if (closest) {
            return (
                <div>
                    <h3>Kaupunkipyörät</h3>
                    <p>Lähin pysäkki jossa pyöriä: <strong>{closest.name} </strong></p>
                    <p>Etäisyys:  <strong>{Math.round(distance * 1000)} metriä </strong></p>
                    <p> {closest.bikes_avail} pyörää saatavilla.</p>

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
