import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

import {Icon} from '../../Widgets/index';
import * as COLOR from '../../../Data/Constant/Color';
import * as SIZE from '../../../Data/Constant/Size';

HeaderIcon.defaultProps = {
    backgroundColor: COLOR.WHITE,
    textSize: SIZE.TEXT_LARGE,
    textColor: COLOR.BLACK,
    textLabel: "",
    iconLeftSource: null,
    iconLeftAction: null,
    iconLeftSize: SIZE.ICON_LARGE,
    iconLeftColor: null,
    iconRightSource: null,
    iconRightAction: null,
    iconRightSize: SIZE.ICON_LARGE,
    iconRightColor: null,
    borderColor: COLOR.GREY
};

HeaderIcon.propTypes = {
    textSize: PropTypes.any,
    textColor: PropTypes.any,
    textLabel: PropTypes.any,
    iconLeftSource: PropTypes.any,
    iconLeftAction: PropTypes.any,
    iconLeftSize: PropTypes.any,
    iconLeftColor: PropTypes.any,
    iconRightSource: PropTypes.any,
    iconRightAction: PropTypes.any,
    iconRightSize: PropTypes.any,
    iconRightColor: PropTypes.any,
    borderColor: PropTypes.any
};

export function HeaderIcon(props) {

    const {backgroundColor} = props;
    const {textSize, textColor, action, borderColor, iconLeftSize, iconRightSize} = props;
    const {textLabel} = props;


    return (
        <View style={{
            flexDirection: "row",
            justifyContent:"center",
            backgroundColor: backgroundColor,
            height: 53,
            borderBottomWidth:1,
            borderColor: borderColor
        }}>
            <View style={{alignSelf: "center", justifyContent: "center"}}>
                <TouchableOpacity onPress={props.iconLeftAction}>
                    <View style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={iconLeftSize}
                            iconName={props.iconLeftSource}
                            iconColor={props.iconLeftColor}
                        />
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
                <TouchableOpacity onPress={props.iconRightAction}>
                    <View style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={iconRightSize}
                            iconName={props.iconRightSource}
                            iconColor={props.iconRightColor}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
