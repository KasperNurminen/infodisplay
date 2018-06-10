/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';



class SimpleDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false
        }
    }


    getLocation = () => {
        this.setState({ loading: true })
        navigator.geolocation.getCurrentPosition((position) => {
            var location = [position.coords.latitude, position.coords.longitude]
            this.props.setLocation(location)
            this.setState({ loading: false })
        })
    }

    render() {
        const { loading } = this.state

        return (
            <Dialog {...this.props}>
                <DialogTitle > Location </DialogTitle>
                <LinearProgress style={{ visibility: loading ? "initial" : "hidden", textAlign: 'center' }} />
                <Button onClick={this.getLocation}
                > Automatically locate me! </Button>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    setLocation: PropTypes.func.isRequired
};

class FindLocationDialog extends React.Component {

    render() {
        return (
            <div>
                <SimpleDialog
                    open={this.props.location === null}
                    setLocation={this.props.setLocation}
                />
            </div>
        );
    }
}
FindLocationDialog.propTypes = {
    setLocation: PropTypes.func.isRequired,
    location: PropTypes.array
}

export default FindLocationDialog;
