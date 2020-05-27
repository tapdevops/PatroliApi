import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import * as COLOR from '../../../Data/Constant/Color';

LineSeperator.defaultProps = {
    style: null,
    direction: "horizontal", //[VERTICAL, HORIZONTAL]
    SeperatorHeight: null,
    SeperatorWidth: null,
    SeperatorColor: COLOR.SEPERATOR_BLACK,
};

LineSeperator.propTypes = {
    style: PropTypes.any,
    direction: PropTypes.any,
    SeperatorHeight: PropTypes.any,
    SeperatorWidth: PropTypes.any,
    SeperatorColor: PropTypes.any
};

export default function LineSeperator(props) {

    let {style, SeperatorHeight, SeperatorWidth, SeperatorColor, direction} = props;

    let styles = [];
    if(direction === "vertical"){
        styles.push({
            width: (SeperatorWidth === null)? 1 : SeperatorWidth,
            height: SeperatorHeight
        });
    }
    else if(direction === "horizontal"){
        styles.push({
            width: SeperatorWidth,
            height: (SeperatorHeight === null)? 1 : SeperatorHeight,
        });
    }

    styles.push({
        backgroundColor: SeperatorColor
    });
    styles.push(style);


    return (
        <View style={styles}/>
    )
}
