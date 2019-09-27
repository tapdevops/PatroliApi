import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';

import {Icon} from '../../Widgets/index';
import * as COLOR from '../../../Data/Constant/Color';
import * as SIZE from '../../../Data/Constant/Size';

HeaderIcon.defaultProps = {
    backgroundColor: COLOR.WHITE,
    textSize: SIZE.fnt_5,
    textColor: COLOR.BLACK,
    textLabel: "",
    iconSourceLeft: null,
    iconSourceRight: null,
    actionIconLeft: null,
    actionIconRight: null,
};

HeaderIcon.propTypes = {
    textSize: PropTypes.any,
    textColor: PropTypes.any,
    textLabel: PropTypes.any,
    iconSourceLeft: PropTypes.any,
    iconSourceRight: PropTypes.any,
    actionIconLeft: PropTypes.any,
    actionIconRight: PropTypes.any,
};

export function HeaderIcon(props) {

    const {backgroundColor} = props;
    const {textSize, textColor, action} = props;
    const {textLabel} = props;


    return (
        <View style={{
            flexDirection: "row",
            justifyContent:"center",
            backgroundColor: backgroundColor,
            height: 53,
            borderBottomWidth:1,
            borderColor: COLOR.GREY
        }}>
            <View style={{alignSelf: "center", justifyContent: "center"}}>
                <TouchableOpacity onPress={props.actionIconLeft}>
                    <View style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={SIZE.fnt_10}
                            iconName={props.iconSourceLeft}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Text
                    style={{
                        fontSize: textSize,
                        color: textColor
                    }}>
                    {textLabel}
                </Text>
            </View>
            <View style={{alignSelf: "center", justifyContent: "center"}}>
                <TouchableOpacity onPress={props.actionIconRight}>
                    <View style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={SIZE.ICON_LARGE}
                            iconColor={COLOR.WHITE}
                            iconName={props.iconSourceRight}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
