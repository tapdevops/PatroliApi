import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '../../Widgets/index';
import * as COLOR from '../../../Data/Constant/Color';
import * as SIZE from '../../../Data/Constant/Size';

Header.defaultProps = {
    backgroundColor: COLOR.WHITE,
    textSize: SIZE.fnt_5,
    textColor: COLOR.BLACK,
    textLabel: "Default",
    action: null
};

Header.propTypes = {
    backgroundColor: PropTypes.any,
    textSize: PropTypes.String,
    textColor: PropTypes.String,
    textLabel: PropTypes.any,
    action: PropTypes.any
};

export function Header(props) {

    const {backgroundColor} = props;
    const {textSize, textColor} = props;
    const {textLabel} = props;


    return (
        <View style={{
            flexDirection: "row",
            backgroundColor: backgroundColor,
            height: 53,
            borderBottomWidth:1,
            borderColor: COLOR.GREY
        }}>
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text
                    textLabel={textLabel}
                    textSize={textSize}
                    textColor={textColor}
                    textFontWeight={"bold"}
                    style={{
                        alignSelf: "center"
                    }}
                />
            </View>
        </View>
    );
}
