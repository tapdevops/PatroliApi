import React, { Component } from 'react';
import {FlatList, TextInput, TouchableOpacity, View} from "react-native";

import loginController from '../Controller/LoginController';

import {Icon, Modal, Text} from "../../../UI/Widgets";
import * as COLOR from "../../../Data/Constant/Color";
import * as SIZE from "../../../Data/Constant/Size";

export class ModalAreaLokasi extends Component{
    constructor(props) {
        super();
        this.state={
            keywordBA: null,
            selectedBA: [],
            // selectedBA: false,
            listBA: loginController.findBAList("ALL")
        }
    }

    removeBA(BAArray, BACode){
        let index = BAArray.indexOf(BACode);
        console.log(index);
        if(index !== -1){
            BAArray.splice(index, 1);
        }
        return BAArray;
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
                            textLabel={"Pilih Area Lokasi"}
                        />
                    </View>
                    <View style={{
                        margin: 5,
                        paddingHorizontal: 5,
                        borderRadius: 25,
                        backgroundColor: COLOR.GREY_3,
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent: "space-between"
                    }}>
                        <Icon
                            style={{paddingLeft: 5}}
                            iconName="search"
                            iconColor={"green"}
                            iconSize={20}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                padding: 0,
                                margin: 0,
                                paddingHorizontal: 10
                            }}
                            value={this.state.keywordBA}
                            onChangeText={(keyword)=> {
                                this.setState({
                                    keywordBA: keyword,
                                    listBA: loginController.findBAList(keyword)
                                });
                            }}
                            placeholder={"Cari area patroli"}
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
                                        borderBottomWidth: 1,
                                        borderRadius: 5,
                                        borderColor: COLOR.GREY
                                    }}
                                    onPress={()=>{
                                        // untuk multiple werks
                                        let tempArray = this.state.selectedBA;
                                        if(!this.state.selectedBA.includes(item.WERKS)){
                                            tempArray = [...tempArray, item.WERKS];
                                        }
                                        else {
                                            tempArray = this.removeBA(tempArray, item.WERKS);
                                        }
                                        this.setState({
                                            selectedBA: tempArray
                                        });
                                        // this.setState({
                                        //     selectedBA: item
                                        // });
                                    }}
                                >
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
                                            iconName= {this.state.selectedBA.includes(item.WERKS) ? "done" : null}
                                            // iconName= {this.state.selectedBA.WERKS === item.WERKS ? "done" : null}
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
                            padding: 10,
                            margin : 10,
                            alignItems:"center"
                        }}
                    >
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