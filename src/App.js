import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Divider from '@material-ui/core/Divider';
import FindLocationDialog from './FindLocationDialog'
import BikeStationModule from './BikeStationModule'
import BusStationModule from './BusStationModule'

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      location: null,
      closest: null
    }
  }

  setLocation = (location) => {
    this.setState({ location })
    localStorage.setItem("location", JSON.stringify(location))
  }



  componentDidMount = () => {
    var location_string = localStorage.getItem("location")
    if (location_string) {
      var location = JSON.parse(location_string)
      this.setLocation(location)
    }
  }
  render() {
    console.log(this.state.location)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Info Display</h1>
        </header>
        <FindLocationDialog
          location={this.state.location}
          setLocation={this.setLocation}
        />
        <BikeStationModule

          location={this.state.location}
        />
        <Divider />
        <BusStationModule

          location={this.state.location}
        />
        <Divider />

      </div>
    );
  }
}

export default App;
