import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import bus_stops from './assets/bus_stops.json'

class BikeStationModule extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            closest: null,
            all_timetables: []
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
    getClosestBusStations = (location) => {
        var sorted = Object.values(bus_stops).map(x => this.getDistance([x.stop_lat, x.stop_lon], x.stop_code, location)).sort()
        var closest_stations = []
        for (var i = 0; i <= 4; i++) {
            var closest = sorted[i]
            closest_stations.push([bus_stops[closest[1]], closest[0]])
        }
        return closest_stations

    }
    getTimeTables = stop_info => {
        return fetch('https://data.foli.fi/siri/sm/' + stop_info[0].stop_code)
            .then(function (response) {
                return response.json();
            })
            .then(function (timetables) {
                let { all_timetables } = this.state
                timetables['result'].forEach(x => {
                    x.stop_name = stop_info[0].stop_name
                    x.distance = Math.round(stop_info[1] * 1000)
                })

                this.setState({ all_timetables: all_timetables.concat(timetables['result'].slice(0, 3)) })

            }.bind(this))

    }
    componentWillReceiveProps(props) {
        let { closest } = this.state
        if (!closest) {
            closest = this.getClosestBusStations(props.location)
        }
        console.log("received props")
        this.setState({ all_timetables: [] })
        closest.forEach(x => this.getTimeTables(x))
        this.setState({ closest: closest })
    }
    sortByKey = (array, key) => {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    renderArrivingBuses = (timetables) => {
        let timetable_html = []
        timetables.forEach((x, i) => {
            timetable_html.push(
                <p key={i}>{x.stop_name}: <strong>{x.lineref}</strong> {x.destinationdisplay} <i>{x.monitored ? "" : "~"}{Math.round((new Date(x.expectedarrivaltime * 1000) - new Date()) / 1000 / 60)} min (Etäisyys {x.distance} metriä)</i> </p>
            )
        })
        return (
            <div>
                {timetable_html}
            </div>
        )
    }
    render() {
        const { closest, all_timetables } = this.state
        var sorted_timetables = this.sortByKey(all_timetables, "expectedarrivaltime")
        var sorted_timetables_no_duplicates = []

        for (var i = 0; i < sorted_timetables.length - 1; i++) {
            if (sorted_timetables[i + 1]['destinationdisplay'] !== sorted_timetables[i]['destinationdisplay']) {
                if (sorted_timetables[i].distance < sorted_timetables[i + 1].distance) {
                    sorted_timetables_no_duplicates.push(sorted_timetables[i]);
                }
                else {
                    sorted_timetables_no_duplicates.push(sorted_timetables[i + 1]);
                }

            }
        }
        if (closest) {
            return (
                <div>
                    <h3>Bussipysäkki-moduuli</h3>
                    <h4>Sinua lähin pysäkki on  {closest[0][0].stop_name}. Se on {Math.round(closest[0][1] * 1000)}  metrin etäisyyllä.</h4>
                    <h4> Saapuvat linjat </h4>
                    <div>{this.renderArrivingBuses(sorted_timetables_no_duplicates)}</div>
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
