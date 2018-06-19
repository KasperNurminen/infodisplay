import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import bus_stops from './assets/bus_stops.json'
import BusIcon from '@material-ui/icons/DirectionsBus';
import { getDistance, sortByKey, groupBy } from './utils.js';
class BikeStationModule extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            closest: null,
            all_timetables: []
        }
    }
    getClosestBusStations = (location) => {
        var sorted = Object.values(bus_stops).map(x => getDistance([x.stop_lat, x.stop_lon], x.stop_code, location)).sort()
        var closest_stations = []
        for (var i = 0; i <= 4; i++) { // get the first few stations
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
                    x.stop_code = stop_info[0].stop_code
                    x.distance = Math.round(stop_info[1] * 1000)
                })

                this.setState({ all_timetables: all_timetables.concat(timetables['result'].slice(0, 3)) })

            }.bind(this))

    }
    componentWillReceiveProps(props) {
        if (!props.location) {
            // ensure that the data gets updated when location changes
            this.setState({
                closest: null,
                all_timetables: []
            })
            return
        }
        let { closest } = this.state
        if (!closest) {
            closest = this.getClosestBusStations(props.location)
        }
        this.setState({ all_timetables: [] })
        closest.forEach(x => this.getTimeTables(x))
        this.setState({ closest: closest })
    }

    parseTime = (time) => { return Math.round((new Date(time * 1000) - new Date()) / 1000 / 60) }

    renderArrivingBuses = (timetables) => {
        let timetable_html = []
        timetables.forEach((x, i) => {
            timetable_html.push(

                <ListItem key={i} button>
                    <ListItemIcon><BusIcon /></ListItemIcon>
                    <ListItemText secondary={x.stop_code + " " + x.stop_name + " (" + x.distance + " metrin päästä)"}>
                        <strong>{x.monitored ? "" : "~"}{this.parseTime(x.expectedarrivaltime)} min:  </strong><i>{x.lineref}</i> {x.destinationdisplay} {x.directionname === "1" ? "(Keskustan suuntaan)" : ""}

                    </ListItemText>
                </ListItem>



            )
        })
        return (
            <List component="nav">
                {timetable_html}
            </List>
        )
    }

    render() {
        const { closest, all_timetables } = this.state
        var grouped_timetables = groupBy(sortByKey(all_timetables, "expectedarrivaltime"), "blockref")
        var closest_lines = []
        for (var group in grouped_timetables) {
            var sorted = sortByKey(grouped_timetables[group], "distance")
            closest_lines.push(sorted[0])
        }
        if (closest) {
            return (
                <div>
                    <h4> Saapuvat bussit </h4>
                    <div>{this.renderArrivingBuses(closest_lines.slice(0, 7))}</div>

                </div >
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
