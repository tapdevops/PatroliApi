import React from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'react-native';

import * as COLOR from "../../../Data/Constant/Color";

//list input type : default,numeric,email-address,phone-pad

RNInputText.defaultProps = {

    action: null,
    inputBlur: null,
    inputBorderColor: null,
    inputColor: COLOR.BLACK,
    inputEditable: true,
    inputFocus: null,
    inputHidden: false,
    inputLength: null,
    inputPlaceholder: "",
    inputPlaceholderColor: "#DDDDDD",
    style: {},
    inputTextSize: null,
    inputType: "default",
    inputUnderline: "transparent",
    inputLine: null,
    inputMultipleLine: false,
    inputValue: null,
    onSubmit: null
};

RNInputText.propTypes = {
    action: PropTypes.any,
    inputBlur: PropTypes.any,
    inputBorderColor: PropTypes.any,
    inputColor: PropTypes.any,
    inputEditable: PropTypes.any,
    inputFocus: PropTypes.any,
    inputHidden: PropTypes.any,
    inputLength: PropTypes.any,
    inputPlaceholder: PropTypes.any,
    inputPlaceholderColor: PropTypes.any,
    style: PropTypes.any,
    inputTextSize: PropTypes.any,
    inputType: PropTypes.any,
    inputUnderline: PropTypes.any,
    inputMultipleLine: PropTypes.any,
    inputLine: PropTypes.any,
    inputValue: PropTypes.any,
    onSubmit: PropTypes.any,
};

export default function RNInputText(props) {
    //view
    const {inputValue, inputType, inputTextSize, inputPlaceholder} = props;
    //color
    const {inputColor, inputPlaceholderColor, inputBorderColor, inputMultipleLine, inputLine, onSubmit} = props;
    //functional
    const {inputFocus, inputBlur, inputEditable, inputHidden, inputLength, inputUnderline} = props;

    const {style} = props;
    const {action} = props;

    const styles = [];

    styles.push({
        color: inputColor,
        fontSize: inputTextSize
    });

    // styles.push({
    //     marginBottom: ((Platform.OS === "ios")? 8:3)
    // });

    styles.push(style);

    return (
        <TextInput
            autoCorrect={false}
            editable={inputEditable}
            inputBorderColor={inputBorderColor}
            keyboardType={inputType}
            maxLength={inputLength}
            multiline={inputMultipleLine}
            onBlur={inputBlur}
            onChangeText={action}
            onFocus={inputFocus}
            placeholder={inputPlaceholder}
            placeholderTextColor={inputPlaceholderColor}
            secureTextEntry={inputHidden}
            style={styles}
            underlineColorAndroid={inputUnderline}
            value={inputValue}
            onSubmitEditing={onSubmit}
        />
    );
}
