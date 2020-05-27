import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, TextInput, TouchableOpacity, View} from 'react-native';

import {HeaderIcon} from '../../UI/Component'
import {Icon, Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class TitikPanasUpdateForm extends Component{
    constructor(){
        super();

        this.state={
            continueVisible: false,
            map:{
                region:{
                    latitude: -6.229196,
                    longitude: 106.825527,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            },
            patroliStatus: false,
            patroliSession: null,

            userName: null,
            titikapi: 0,

            location:{
                fakeGPS: false,
                latitude: null,
                longitude: null
            },

            timer:{
                time: "00:00:00",
                jam: 0,
                menit: 0,
                detik: 0,
            }
        }
    }

    async componentDidMount(): void {}

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    textLabel={"Penanganan Titik Panas"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={COLOR.GREY}
                    iconLeftSource={"keyboard-arrow-left"}
                    iconLeftSize={SIZE.ICON_LARGE+30}
                    iconLeftAction={()=>{this.props.navigation.pop()}}
                />
                <ScrollView style={{flex: 1}}>
                    <Image
                        style={{
                            backgroundColor:"red",
                            width: screenWidth,
                            height:screenHeight*0.33
                        }}
                        source={LOGO_APP}
                        resizeMode={"stretch"}
                    />
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Text
                            style={{paddingTop: 10}}
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_MEDIUM}
                            textLabel={"#DR-4122-2003191342"}
                        />
                        <Text
                            style={{paddingVertical: 5}}
                            textFontFamily={"BOLD"}
                            textLabel={"Di laporkan doni romdoni - 20 MAR 2020, 09:00"}
                        />
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                onPress={()=>{}}
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 37.5,
                                    backgroundColor:"red",
                                    alignItems:'center',
                                    justifyContent:"center",
                                    marginHorizontal: 10,
                                    marginTop: 10,
                                }}>
                                <Image
                                    style={{
                                        width: 30, height: 30
                                    }}
                                    source={LOGO_APP}
                                    resizeMode={"stretch"}
                                />
                                <Text
                                    textFontAlign={"center"}
                                    textLabel={"Titik Api"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{}}
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 37.5,
                                    backgroundColor:"red",
                                    alignItems:'center',
                                    justifyContent:"center",
                                    marginHorizontal: 10,
                                    marginTop: 10
                                }}>
                                <Text
                                    textLabel={"Aman"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 25, marginVertical: 15}}>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Tanggal Laporan *"}
                            />
                            <View style={{
                                flexDirection:"row",
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderBottomWidth: 1,
                                justifyContent:"space-between",
                                alignItems:"center"
                            }}>
                                <TextInput
                                    style={{padding: 0, margin: 0}}
                                    value={this.state.userName}
                                    onChangeText={(value) => {
                                        this.setState({
                                            userName: value
                                        })
                                    }}
                                    placeholder={"Tanggal"}
                                />
                                <Icon
                                    iconName={"date-range"}
                                />
                            </View>
                        </View>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Luas area kebakaran (dalam HA)"}
                            />
                            <View style={{
                                flexDirection:"row",
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderBottomWidth: 1,
                                justifyContent:"space-between",
                                alignItems:"center"
                            }}>
                                <TextInput
                                    style={{padding: 0, margin: 0}}
                                    value={this.state.userName}
                                    onChangeText={(value) => {
                                        this.setState({
                                            userName: value
                                        })
                                    }}
                                    placeholder={"Diisi estimasi luas kebakaran (dalam HA)"}
                                />
                            </View>
                        </View>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Keterangan Tambahan"}
                            />
                            <View style={{
                                flexDirection:"row",
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderBottomWidth: 1,
                            }}>
                                <TextInput
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                    }}
                                    multiline={true}
                                    value={this.state.userName}
                                    onChangeText={(value) => {
                                        this.setState({
                                            userName: value
                                        })
                                    }}
                                    placeholder={"Tulis keterangan disini..."}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    continueVisible: true
                                })
                            }}
                            style={{
                                width: 225,
                                height: 40,
                                borderRadius: 10,
                                paddingHorizontal: 25,
                                paddingVertical: 10,
                                alignSelf:"center",
                                alignItems:"center",
                                backgroundColor:COLOR.RED_1,
                            }}>
                            <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }

}
