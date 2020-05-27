import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';

import {Modal} from '../Widgets/';

export class ModalLoading extends Component {
    render(){
        return (
            <Modal
                modalPreset={"full"}
                overlayColor={"rgba(0, 0, 0, 0.3)"}
                modalVisible={this.props.show}
                modalBackgroundColor={"transparent"}>
                <View
                    style={{
                        flex: 1,
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </Modal>
        )
    }
}
