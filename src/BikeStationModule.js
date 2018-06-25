import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { getDistance } from './utils.js';
import { getClosestBikeStation } from './actions/closestBikeStationActions';
import { connect } from 'react-redux';

class BikeStationModule extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            distance: null,
            lastUpdated: (new Date()).getTime()
        }
    }

    getClosestBikeStation = (location) => {
        return fetch('https://data.foli.fi/citybike')
            .then(function (response) {
                return response.json();
            })
            .then(function (citybike_stops) {
                var sorted = Object.values(citybike_stops['racks']).map(x => getDistance([x.lat, x.lon], x.id, location)).sort()
                var closest_with_bikes
                let i = -1
                do { // iteratively find the first station with a bike
                    i++
                    // eslint-disable-next-line
                    closest_with_bikes = Object.values(citybike_stops['racks']).find(x => x.id === sorted[i][1])
                } while (closest_with_bikes.bikesAvailable === 0)
                return [closest_with_bikes, sorted[i][0]]

            })


    }
    componentWillReceiveProps = (props) => {
        if (!props.location) {
            return
        }


        if (props.lastUpdated !== this.state.lastUpdated) {
            console.log("updating bike data")
            this.getClosestBikeStation(props.location)
                .then(closest_and_distance => {
                    this.setState({ distance: closest_and_distance[1], lastUpdated: props.lastUpdated })
                    this.props.addClosestStationToState(closest_and_distance[0])
                })
        }

    }

    render() {
        const { distance } = this.state
        const { closestBikeStation } = this.props
        if ( closestBikeStation) {
            return (
                <div>
                    <h3>Kaupunkipyörät</h3>
                    <p>Lähin pysäkki jossa pyöriä: <strong>{ closestBikeStation.name} </strong></p>
                    <p>Etäisyys:  <strong>{Math.round(distance * 1000)} metriä </strong></p>
                    <p> { closestBikeStation.bikes_avail} pyörää saatavilla.</p>

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

const mapStateToProps = (state) => {
    return ({
        location: state.location.userLocation,
        closestBikeStation: state.closestBikeStation.closestBikeStationArray
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        addClosestStationToState: (closest) => dispatch(getClosestBikeStation(closest))
    })

}
export default connect(mapStateToProps, mapDispatchToProps)(BikeStationModule);


