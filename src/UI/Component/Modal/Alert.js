import React, { Component } from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Text, Modal, Icon} from '../../Widgets';

import * as COLOR from "../../../Data/Constant/Color";
import * as SIZE from "../../../Data/Constant/Size";

export class Alert extends Component {
    render() {
        return (
            <Modal
                modalVisible={this.props.visible}
            >
                <View style={{
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor:COLOR.WHITE
                }}>
                    <View style={{marginTop: 15, marginBottom: 10}}>
                        <Image
                            style={{
                                width: 185,
                                height: 185,
                                alignSelf:'center'
                            }}
                            source={this.props.alertIcon ? this.props.alertIcon : require('../../../Asset/Logo/apps_logo.png')}
                            resizeMode={"stretch"}
                        />
                    </View>
                    <View style={{flex: 1, alignItems:"center", paddingHorizontal: 10}}>
                        <Text
                            style={{paddingBottom: 10}}
                            textFontFamily={"BOLD"}
                            textSize={SIZE.TEXT_LARGE}
                            textLabel={this.props.alertTitle}
                        />
                        <Text
                            textFontAlign={"center"}
                            textLabel={this.props.alertDescription}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.action()
                        }}
                        style={{
                            backgroundColor: COLOR.RED_1,
                            borderRadius: 5,
                            marginHorizontal: 10,
                            marginTop: 10,
                            marginBottom: 17.5,
                            padding: 10,
                            alignItems:"center"
                        }}
                    >
                        <Text
                            textSize={SIZE.TEXT_MEDIUM}
                            textColor={COLOR.WHITE}
                            textLabel={"Tutup"}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}