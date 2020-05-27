import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';


RNButton.defaultProps = {
    action: null,
    buttonBorder: 0,
    buttonBorderColor: "transparent",
    buttonColor: "transparent",
    buttonRounded: 0,
    buttonDisabled: false,
    style: null,
};

RNButton.propTypes = {
    action: PropTypes.any,
    buttonBorder: PropTypes.any,
    buttonBorderColor: PropTypes.any,
    buttonColor: PropTypes.any,
    buttonRounded: PropTypes.any,
    buttonDisabled: PropTypes.any,
    style: PropTypes.object,
};

export default function RNButton(props) {
    const {
        buttonBorder,
        buttonBorderColor,
        buttonColor,
        buttonRounded,
        buttonDisabled,
        style,
    } = props;

    const {
        action,
        children,
    } = props;

    const styles = [];
    styles.push({
        flexDirection: "row",
    });
    styles.push({
        backgroundColor: buttonColor,
        borderColor: buttonBorderColor,
        borderRadius: buttonRounded,
        borderWidth: buttonBorder,
    });
    //custom style
    styles.push(
        style
    );

    return (
        <TouchableOpacity
            disabled={buttonDisabled}
            activeOpacity={1}
            onPress={action}
            style={styles}
        >
            {children}
        </TouchableOpacity>
    );
}
