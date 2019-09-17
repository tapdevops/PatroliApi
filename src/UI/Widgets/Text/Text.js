import React from 'react';
import PropTypes from 'prop-types';
import {Platform, Text} from 'react-native';

import * as COLOR from "../../../Data/Constant/Color";

RNText.defaultProps = {
    textBackgroundColor: "transparent",
    textColor: COLOR.TEXT_GREY,
    textFontAlign: 'left',
    textFontWeight: "normal",
    textFontStyle: "normal",
    textLabel: null,
    textLines: null,
    textSize: 12,
    textSpacing: ((Platform.OS === "ios")? null:null),
    style: {},
};

RNText.propTypes = {
    textBackgroundColor: PropTypes.any,
    textColor: PropTypes.any,
    textFontAlign: PropTypes.any,
    textFontWeight: PropTypes.any,
    textFontStyle: PropTypes.any,
    textLabel: PropTypes.any,
    textLines: PropTypes.any,
    textSize: PropTypes.any,
    textSpacing: PropTypes.any,
    style: PropTypes.any,
};

export default function RNText(props) {

    const {
        children,
        textColor,
        textFontAlign,
        textFontWeight,
        textFontStyle,
        textLines,
        textSize,
        textSpacing
    } = props;
    const {textLabel} = props;
    const {style} = props;

    const styles = [];
    styles.push({
        backgroundColor: "transparent",
        color: textColor,
        fontFamily: "futura",
        fontSize: textSize,
        fontWeight: textFontWeight === "bold" ? '500' : null,
        fontStyle: textFontStyle,
        margin: 0,
        marginBottom: ((Platform.OS === "ios")? 3:0),
        padding: 0,
        textAlign: textFontAlign,
        lineHeight: textSpacing,
        letterSpacing: 1
    });
    styles.push(style);

    return (
        <Text
            numberOfLines={textLines}
            style={styles}>
            {textLabel}
            {children}
        </Text>
        )
    }
