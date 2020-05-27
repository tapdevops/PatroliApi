import React, { Component } from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";

import BAController from '../../Modules/Controller/BAController';
import userController from '../../Modules/Controller/UserController';

import {Icon, Modal, Text} from "../../UI/Widgets";
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

export class ModalPilihBA extends Component{
    constructor(props) {
        super();
        this.state={
            selectedBA: {WERKS: props.defaultWerks ? props.defaultWerks : null},
            listBA: userController.isUserAuthorized() ? BAController.getAllBA() : BAController.getActiveBA()
        }
    }

    render(){
        return(
            <Modal
                // modalClose={this.props.modalClose}
                modalVisible={this.props.visible}
            >
                <View style={{
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor:COLOR.WHITE
                }}>
                    <View style={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        alignItems:"center",
                        justifyContent: "center"
                    }}>
                        <Text
                            textFontFamily={"HEADER"}
                            style={{paddingVertical: 15}}
                            textSize={SIZE.TEXT_MEDIUM}
                            textLabel={"Wilayah Patroli"}
                        />
                    </View>
                    <FlatList
                        data={this.state.listBA}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) => {
                            return(
                                <TouchableOpacity
                                    style={{
                                        margin: 5,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: COLOR.GREY
                                    }}
                                    onPress={()=>{
                                        this.setState({
                                            selectedBA: item
                                        });
                                    }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection:"row",
                                        paddingHorizontal: 10,
                                        paddingVertical: 2,
                                        alignItems:"center",
                                        justifyContent:"space-between",
                                    }}>
                                        <Text
                                            style={{flex: 1, paddingVertical: 10}}
                                            textSize={SIZE.TEXT_SMALL - 2}
                                            textLabel={`${item.WERKS} - ${item.EST_NAME}`}
                                        />
                                        <Icon
                                            style={{alignItems:"center"}}
                                            iconName= {this.state.selectedBA.WERKS === item.WERKS ? "done" : null}
                                            iconColor={"green"}
                                            iconSize={20}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.modalAction(this.state.selectedBA)
                        }}
                        style={{
                            backgroundColor: COLOR.RED_1,
                            borderRadius: 5,
                            margin: 10,
                            padding: 10,
                            alignItems:"center"
                        }}>
                        <Text
                            textColor={COLOR.WHITE}
                            textLabel={"Pilih"}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}