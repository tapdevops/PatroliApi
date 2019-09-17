import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import {Button, Container, Icon, Text} from '../../Widgets/index';
import * as COLOR from '../../../Data/Constant/Color';
import * as SIZE from '../../../Data/Constant/Size';

HeaderIcon.defaultProps = {
    backgroundColor: COLOR.WHITE,
    textSize: SIZE.fnt_5,
    textColor: COLOR.BLACK,
    textLabel: "",
    iconSourceLeft: "keyboard-arrow-left",
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
                <Button action={props.actionIconLeft}>
                    <Container style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={SIZE.fnt_10}
                            iconName={props.iconSourceLeft}/>
                    </Container>
                </Button>
            </View>
            <View style={{flex: 1, alignSelf: "center", justifyContent: "center"}}>
                <Text
                    textSpacing={null}
                    textFontAlign={"center"}
                    textLabel={textLabel}
                    textSize={textSize}
                    textColor={textColor}
                    textLines={1}
                />
            </View>
            <View style={{alignSelf: "center", justifyContent: "center"}}>
                <Button action={props.actionIconRight}>
                    <Container style={{
                        width: 50,
                        height: 53,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Icon
                            iconSize={SIZE.fnt_10}
                            iconName={props.iconSourceRight}/>
                    </Container>
                </Button>
            </View>
        </View>
    );
}