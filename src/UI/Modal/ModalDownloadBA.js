import React, { Component } from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";

import BAController from '../../Modules/Controller/BAController';

import {Icon, Modal, Text} from "../../UI/Widgets";
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

export class ModalDownloadBA extends Component{
    constructor(props) {
        super();
        this.state={
            downloadedBA: BAController.getActiveBACodeOnly(),
            listBA: BAController.getAllBA(),
            selectedBA: [...BAController.getActiveBACodeOnly()]
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
                                    // disabled={this.state.downloadedBA.includes(item.WERKS)}
                                    onPress={()=>{
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
                                            iconName= {this.state.selectedBA.includes(item.WERKS) ? "done" : null}
                                            // iconName= {this.state.selectedBA.includes(item.WERKS) || this.state.downloadedBA.includes(item.WERKS) ? "done" : null}
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
                            if(this.state.selectedBA.length !== 0){
                                for(let x = 0; x < this.state.downloadedBA.length; x++){
                                    if(!this.state.selectedBA.includes(this.state.downloadedBA[x])){
                                        let status = BAController.deactivateBA(this.state.downloadedBA[x]);
                                        console.log(`DEACTIVATE ${this.state.downloadedBA[x]}`, status);
                                    }
                                }
                                this.props.modalAction(this.state.selectedBA)
                            }
                            else {
                                alert("BA tidak boleh kosong!")
                            }
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

    removeBA(BAArray, BACode){
        let index = BAArray.indexOf(BACode);
        if(index !== -1){
            BAArray.splice(index, 1);
        }
        return BAArray;
    }
}