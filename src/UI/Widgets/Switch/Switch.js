import React from 'react';
import PropTypes from 'prop-types';
import {Switch} from 'react-native';

RNSwitch.defaultProps = {
    action: null,
    toggleValue: null,
};

RNSwitch.propTypes = {
    action: PropTypes.any,
    toggleValue: PropTypes.any,
};

export default function RNSwitch(props) {
    let {
        action,
        toggleValue,
    } = props;
    return (
        <Switch
            onValueChange={action}
            value={toggleValue}
        />
    )
}
