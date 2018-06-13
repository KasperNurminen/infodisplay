import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Divider from '@material-ui/core/Divider';
import FindLocationDialog from './FindLocationDialog'
import BikeStationModule from './BikeStationModule'
import BusStationModule from './BusStationModule'
import Button from '@material-ui/core/Button';
import EditLocation from '@material-ui/icons/EditLocation'
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      location: null,
      lastUpdated: (new Date()).getTime(),
      hasLocation: false
    }
  }

  setLocation = (location) => {
    this.setState({ location, hasLocation: true })
    localStorage.setItem("location", JSON.stringify(location))
  }
  removeLocation = () => {
    this.setState({ location: null, hasLocation: false })
    localStorage.clear()
  }
  updateData = () => {
    this.setState({ lastUpdated: (new Date()).getTime() })
  }

  componentDidMount = () => {
    var location_string = localStorage.getItem("location")
    if (location_string) {
      var location = JSON.parse(location_string)
      this.setLocation(location)
    }
    setInterval(this.updateData, 1000 * 60)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">

          <img src={logo} className="App-logo" alt="logo" />
          <Button style={{ float: "right" }} onClick={() => this.removeLocation()} color="primary" variant="contained">
            Muuta sijaintia
              <EditLocation />
          </Button>
          <h1 className="App-title">Info Display</h1>
        </header>
        <FindLocationDialog
          location={this.state.location}
          setLocation={this.setLocation}
          hasLocation={this.state.hasLocation}
        />
        <BikeStationModule
          lastUpdated={this.state.lastUpdated}
          location={this.state.location}
        />
        <Divider />
        <BusStationModule
          lastUpdated={this.state.lastUpdated}
          location={this.state.location}
        />
        <Divider />

      </div>
    );
  }
}

export default App;
