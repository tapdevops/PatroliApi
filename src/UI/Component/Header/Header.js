import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '../../Widgets/index';
import * as COLOR from '../../../Data/Constant/Color';
import * as SIZE from '../../../Data/Constant/Size';

Header.defaultProps = {
    backgroundColor: COLOR.WHITE,
    textSize: SIZE.TEXT_MEDIUM,
    textColor: COLOR.BLACK,
    textLabel: "Default",
    borderColor: COLOR.BLACK,
    action: null
};

Header.propTypes = {
    backgroundColor: PropTypes.any,
    textSize: PropTypes.any,
    textColor: PropTypes.any,
    textLabel: PropTypes.any,
    borderColor: PropTypes.any,
    action: PropTypes.any
};

export function Header(props) {

    const {backgroundColor} = props;
    const {textSize, textColor, borderColor} = props;
    const {textLabel} = props;


    return (
        <View style={{
            flexDirection: "row",
            backgroundColor: backgroundColor,
            height: 53,
            borderBottomWidth:1,
            borderColor: borderColor
        }}>
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text
                    textLabel={textLabel}
                    textSize={textSize}
                    textColor={textColor}
                    textFontFamily={"HEADER"}
                    style={{
                        alignSelf: "center"
                    }}
                />
            </View>
        </View>
    );
}
