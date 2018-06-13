/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import LocationIcon from '@material-ui/icons/MyLocation';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
const inputStyle = {
    width: "70%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    marginTop: 4
}
const provider = new OpenStreetMapProvider();

class SimpleDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            suggestions: [],
            search: ""
        }
    }
    handleSearchChange = (event) => {
        this.setState({
            search: event.target.value
        })
        this.searchByAddress(event)
    }
    censorForTurku = (string) => { return string }
    splitString = (string) => { return string.split(",").slice(0, 4).join(", ") }
    searchByAddress = (event) => {
        var query = event.target.value

        provider.search({ query: query, })
            .then((results) => {
                var suggestions = results.map(x => x.label).filter(x => x.includes("Turku")).map(x => this.splitString(x))
                this.setState({
                    suggestions: suggestions
                })
                if (query.length > 16) {
                    var first = results[0]
                    if (first && first.x && first.y) {

                        this.props.setLocation([first.y, first.x])
                    }

                }

            })

    }

    getLocation = () => {
        this.setState({ loading: true })
        navigator.geolocation.getCurrentPosition((position) => {
            var location = [position.coords.latitude, position.coords.longitude]
            this.props.setLocation(location)
            this.setState({ loading: false })
        }, (error) => { alert(error.message) })
    }
    renderSuggestions = () => {

        var suggestionOptions = this.state.suggestions.map((x, i) => {
            return (
                <option
                    value={x}
                    key={i}
                />
            )
        })

        return (
            <datalist id="suggestions" >
                {suggestionOptions}
            </datalist>
        )
    }
    render() {
        const { loading } = this.state

        return (
            <Dialog open={this.props.open} >
                <DialogTitle > Sijainnin määritys </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Määritä sijaintisi joko painamalla paikannusnappia tai antamalla osoitteesi.
                    </DialogContentText>



                    <div style={{ display: "inline-block", width: "100%" }}>
                        <input style={inputStyle} list="suggestions" placeholder="Etsi osoitteen perusteella..." value={this.state.search} onChange={event => this.handleSearchChange(event)} />
                        {this.renderSuggestions()}


                        <IconButton onClick={this.getLocation}>
                            < LocationIcon />
                        </IconButton>

                    </div>
                    <LinearProgress style={{ visibility: loading ? "initial" : "hidden", textAlign: 'center' }} />
                </DialogContent>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    setLocation: PropTypes.func.isRequired
};

class FindLocationDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        }
    }
    // following two functions are because material-ui dialog bugs out if open-state changes quickly
    // feel free to fix
    componentWillReceiveProps = (props) => {
        this.setState({ open: !props.hasLocation })
    }
    componentDidMount = () => {
        this.setState({ open: !this.props.hasLocation })
    }

    render() {
        return (
            <div>
                <SimpleDialog
                    open={this.state.open}
                    setLocation={this.props.setLocation}
                />
            </div>
        );
    }
}
FindLocationDialog.propTypes = {
    setLocation: PropTypes.func.isRequired,
    location: PropTypes.array,
    hasLocation: PropTypes.bool.isRequired
}

export default FindLocationDialog;
