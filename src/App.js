import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Divider from '@material-ui/core/Divider';
import FindLocationDialog from './FindLocationDialog'
import BikeStationModule from './BikeStationModule'
import BusStationModule from './BusStationModule'
import Button from '@material-ui/core/Button';
import EditLocation from '@material-ui/icons/EditLocation'
import { connect } from 'react-redux';
import { getLocation } from './actions/locationActions';

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
      this.setState({ hasLocation: true })
      this.props.addLocationToState(location);
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
          setLocation={this.setLocation}
          hasLocation={this.state.hasLocation}
        />
        <BikeStationModule
          lastUpdated={this.state.lastUpdated}
        />
        <Divider />
        <BusStationModule
          lastUpdated={this.state.lastUpdated}
        />
        <Divider />

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return ({
    location: state.userLocation
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    addLocationToState: (loc) => dispatch(getLocation(loc))
  })

}
export default connect(mapStateToProps, mapDispatchToProps)(App);
