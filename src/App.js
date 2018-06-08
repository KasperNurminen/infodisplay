import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import bus_stops from './assets/bus_stops.json'

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      location: null,
      closest: null
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
  getLocation = () => {
    return navigator.geolocation.getCurrentPosition((position) => {
      var location = [position.coords.latitude, position.coords.longitude]
      this.setState({ "location": location })
      localStorage.setItem("location", JSON.stringify(location))
    })
  }


  getClosest = () => {
    console.log(this.state.location)
    var sorted = Object.values(bus_stops).map(x => this.getDistance([x.stop_lat, x.stop_lon], x.stop_code, this.state.location)).sort()
    var closest = sorted[0]
    console.log(closest)
    console.log(bus_stops[closest[1]])
    this.setState({ "closest": bus_stops[closest[1]] })
  }

  componentDidMount = () => {
    var location_string = localStorage.getItem("location")
    if (!location_string) {
      this.getLocation()
    }
    else {
      this.setState({ location: JSON.parse(location_string) }, this.getClosest)
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Sinua lähin pysäkki on {this.state.closest ? this.state.closest.stop_name : ""}
        </p>
      </div>
    );
  }
}

export default App;
