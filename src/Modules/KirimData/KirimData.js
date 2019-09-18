import React, {Component} from 'react';
import {Text, View, Image, FlatList, TouchableOpacity} from 'react-native';

import {createFileUTF8} from '../../Data/Function/FetchBlob';
import {directoryKML} from '../../Data/Constant/FilePath';

import RealmServices from '../../Data/Realm/RealmServices';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

import {Header} from "../../UI/Component";

export default class KirimData extends Component{
    constructor(){
        super();
        this.state={
            sessionList: []
        }
    }

    componentDidMount(): void {
        this.getAllSession();
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    backgroundColor={"red"}
                    textLabel={"Kirim Data"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                />
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        margin: 25,
                        alignSelf:"center"
                    }}>Datamu</Text>
                    {this.renderSessionList()}
                </View>
            </View>
        )
    }

    renderSessionList(){
        if(this.state.sessionList.length > 0){
            return (
                <FlatList
                    style={{marginVertical: 5}}
                    data={this.state.sessionList}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                        return (
                            <View style={{
                                marginHorizontal: "10%"
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                    <Text>{item.NAME+"_"+item.ID}</Text>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            let fileName = item.NAME+"_"+item.ID+".kml";
                                            let fileData = "hello world";
                                            this.generateKMLFile(fileName.toString(), fileData.toString());
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25
                                            }}
                                            source={require('../../Asset/Icon/ic_email.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                />
            )
        }
        else {
            return (
                <View style={{
                    flex: 1,
                    alignItems:"center",
                    justifyContent:"center"
                }}>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        textLabel={"Data Kosong"}
                    />
                </View>
            )
        }
    }

    getAllSession(){
        let sessionData = RealmServices.getAllData("TABLE_SESSION");
        this.setState({
            sessionList: sessionData
        });
    }

    generateKMLFile(fileName, fileData){
        let finalPath = directoryKML + "/" + fileName;
        console.log("final path",finalPath);
        createFileUTF8(finalPath, fileData)
            .then((response)=>{
                console.log("GENERATE KML", response);
            })
    }

    generateKMLData(){

    }

}
