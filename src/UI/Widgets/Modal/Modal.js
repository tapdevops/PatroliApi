import React from 'react';
import PropTypes from 'prop-types';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';

const ANIMATION = ['none', 'slide', 'fade'];
const preset = ['default', 'full'];

Modals.defaultProps = {
    height: "50%",
    modalAnimation: 'fade',
    modalBackgroundColor: 'transparent',
    modalClose: null,
    modalOnClose: null,
    modalStyle: {},
    modalPreset: "default",
    modalVisible: false,
    overlayColor: "rgba(0, 0, 0, 0.6)",
    width: "75%",
};

Modals.propTypes = {
    height: PropTypes.any,
    modalAnimation: PropTypes.oneOf(ANIMATION),
    modalBackgroundColor: PropTypes.any,
    modalClose: PropTypes.any,
    modalStyle: PropTypes.any,
    modalPreset: PropTypes.oneOf(preset),
    modalVisible: PropTypes.any,
    overlayColor: PropTypes.any,
    width: PropTypes.any,
};

export default function Modals(props) {

    let {
        height,
        width,
    } = props;
    let {
        modalAnimation,
        modalBackgroundColor,
        modalClose,
        modalStyle,
        modalVisible,
        overlayColor,
    } = props;
    let {
        modalPreset
    } = props;

    let modalStyles = [];

    function checkType(){
        if(modalPreset === "default")
        {
            return {
                backgroundColor: modalBackgroundColor,
                height: height,
                width: width,
            }
        }
        else if(modalPreset === "full"){
            return {
                backgroundColor: modalBackgroundColor,
                height: "100%",
                width: "100%",
            }
        }
    }
    modalStyles.push(checkType());
    modalStyles.push(modalStyle);

    return (
        <Modal
            style={{flex: 1}}
            animationType={modalAnimation}
            supportedOrientations={['landscape', 'portrait']}
            transparent
            visible={modalVisible}
            onRequestClose={()=>{}}>
            <TouchableWithoutFeedback
                onPress={modalClose}>
                <View style={
                    {
                        alignItems: "center",
                        backgroundColor: overlayColor,
                        bottom: 0,
                        justifyContent: "center",
                        left: 0,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                    }}>
                    <View
                        style={modalStyles}
                    >
                        {props.children}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
