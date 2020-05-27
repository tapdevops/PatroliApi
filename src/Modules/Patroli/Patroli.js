import React, {Component} from 'react';
import {NativeModules, TouchableOpacity, View, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation';
import patroliController from './Controller/PatroliController';

import {ModalPilihBA} from './Modal/PatroliApi_PilihBA'

import {Header} from '../../UI/Component'
import {Text, Icon} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

export default class Patroli extends Component{
    constructor(){
        super();
        this.state={
            markerFlag: true,
            map:{
                region:{
                    latitude: -6.229196,
                    longitude: 106.825527,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            },

            location:{
                fakeGPS: false,
                accuracy: null,
                latitude: null,
                longitude: null
            },

            modalVisible: false,
            dataJalur: {
                activeWerks: [],
                selectedWerks: null,
                jalurPatroli: [],
                jalurFirstIndex: [],
                selectedJalur: 1
            }
        }
    }

    getMasterData(){
        let activeWerks = patroliController.getActiveWerks();
        let jalurPatroli = patroliController.getJalur(activeWerks[0].WERKS, this.state.dataJalur.selectedJalur);
        // coordinate data index[0] per jalur
        let jalurFirstIndex = patroliController.getNoOfJalur(activeWerks[0].WERKS);
        if(activeWerks.length > 0 && jalurPatroli.length > 0 && jalurFirstIndex.length > 0){
            this.setState({
                dataJalur: {
                    ...this.state.dataJalur,
                    selectedWerks: activeWerks[0].WERKS,
                    activeWerks: activeWerks,
                    jalurPatroli: jalurPatroli,
                    jalurFirstIndex: jalurFirstIndex,
                    selectedJalur: 1
                }
            });
        }
        else {
            alert("Data jalur kosong");
        }
    }

    // updateJalur(WERKS){
    //     let jalurPatroli = patroliController.getJalur(WERKS, this.state.dataJalur.selectedJalur);
    //     // coordinate data index[0] per jalur
    //     let jalurFirstIndex = patroliController.getNoOfJalur(WERKS);
    //     this.setState({
    //         dataJalur: {
    //             ...this.state.dataJalur,
    //             selectedWerks: WERKS,
    //             jalurPatroli: jalurPatroli,
    //             jalurFirstIndex: jalurFirstIndex
    //         }
    //     });
    // }

    async componentDidMount(): void {
        this.getMasterData();
        this.getCurrentLocation();

        this.didFocus = this.props.navigation.addListener(
            'focus',
            async ()=>{
                this.getMasterData();
                this.getCurrentLocation();
            }
        );

        setTimeout(()=>{
            this.setState({
                markerFlag: false
            })
        }, 1000)
    }

    render(){
        return(
            <View
                style={{
                    flex: 1,
                }}>
                <Header
                    textLabel={"Patroli Api"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={"transparent"}
                />
                <View
                    style={{
                        backgroundColor: (this.state.location.latitude && this.state.location.accuracy <= 30) ? COLOR.GREEN_1 : COLOR.YELLOW,
                        alignItems:"center",
                        justifyContent:"center",
                        paddingVertical: 10
                    }}
                >
                    <Text
                        textFontFamily={"BOLD"}
                        textSize={SIZE.TEXT_SMALL}
                        textLabel={(this.state.location.latitude && this.state.location.accuracy <= 30) ? "Jaringan GPS Aman" : "Menunggu Jaringan GPS..."}
                    />
                </View>
                <View style={{flex: 1}}>
                    <MapView
                        ref={(MapView)=>{this.MapView = MapView}}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={{flex: 1}}
                        mapType={"satellite"}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        initialRegion={this.state.map.region}
                    >
                        {
                            this.state.dataJalur.jalurPatroli.length > 0 &&
                            <View>
                                <Polyline
                                    coordinates={this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli : null}
                                    strokeColor="white" // fallback for when `strokeColors` is not supported by the map-provider
                                    strokeWidth={3}
                                />
                                <Marker
                                    tracksViewChanges={this.state.markerFlag}
                                    coordinate={{
                                        latitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].latitude : 0.0,
                                        longitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].longitude : 0.0
                                    }}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25
                                        }}
                                        source={require("../../Asset/Icon/ic_finish.png")}
                                        resizeMode={"stretch"}
                                    />
                                </Marker>
                                <Marker
                                    tracksViewChanges={this.state.markerFlag}
                                    coordinate={{
                                        latitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[0].latitude : null,
                                        longitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[0].longitude : null
                                    }}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25
                                        }}
                                        source={require("../../Asset/Icon/ic_start.png")}
                                        resizeMode={"stretch"}
                                    />
                                </Marker>
                            </View>
                        }
                        {/*{
                            this.state.dataJalur.jalurPatroli.length > 0
                            &&
                            <Polyline
                                coordinates={this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli : null}
                                strokeColor="white" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeWidth={3}
                            />
                            &&
                            <Marker
                                tracksViewChanges={this.state.markerFlag}
                                coordinate={{
                                    latitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].latitude : 0.0,
                                    longitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].longitude : 0.0
                                }}>
                                <Image
                                    style={{
                                        width: 25,
                                        height: 25
                                    }}
                                    source={require("../../Asset/Icon/ic_finish.png")}
                                    resizeMode={"stretch"}
                                />
                            </Marker>
                            &&
                            <Marker
                                tracksViewChanges={this.state.markerFlag}
                                coordinate={{
                                    latitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[0].latitude : null,
                                    longitude: this.state.dataJalur.jalurPatroli.length > 0 ? this.state.dataJalur.jalurPatroli[0].longitude : null
                                }}>
                                <Image
                                    style={{
                                        width: 25,
                                        height: 25
                                    }}
                                    source={require("../../Asset/Icon/ic_start.png")}
                                    resizeMode={"stretch"}
                                />
                            </Marker>
                        }*/}
                    </MapView>
                    <View style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                    }}>
                        <TouchableOpacity
                            style={{
                                margin: 10,
                                padding: 10,
                                backgroundColor:COLOR.WHITE,
                                borderRadius: 25,
                                alignSelf:"flex-end"
                            }}
                            onPress={()=>{
                                this.setState({
                                    modalVisible: true
                                })
                            }}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                    alignSelf:'center'
                                }}
                                source={require('../../Asset/Icon/ic_filter.png')}
                                resizeMode={"stretch"}
                            />
                        </TouchableOpacity>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: "flex-end",
                            justifySelf: "flex-end",
                            marginBottom: 10,
                        }}>
                            {this.state.dataJalur.jalurFirstIndex.map((dataJalur, index)=>{
                                return(
                                    <TouchableOpacity
                                        key={index}
                                        onPress={()=>{
                                            let selectedWerks = this.state.dataJalur.selectedWerks ? this.state.dataJalur.selectedWerks : this.state.dataJalur.activeWerks[0].WERKS;
                                            let tempJalur = patroliController.getJalur(selectedWerks, dataJalur.JALUR);
                                            this.setState({
                                                dataJalur: {
                                                    ...this.state.dataJalur,
                                                    jalurPatroli: tempJalur,
                                                    selectedJalur: dataJalur.JALUR
                                                }
                                            },()=>{
                                                this.MapView.animateCamera(
                                                    {
                                                        "center": {
                                                            "latitude": dataJalur.LATITUDE,
                                                            "longitude": dataJalur.LONGITUDE
                                                        },
                                                        "heading": 0,
                                                        "pitch": 0,
                                                        "zoom": 12.658798217773438
                                                    },{
                                                        duration: 1000
                                                    }
                                                )
                                            });
                                        }}
                                        style={{
                                            backgroundColor:COLOR.WHITE,
                                            paddingVertical: 5,
                                            paddingHorizontal: 10,
                                            borderRadius: 20,
                                            borderColor: COLOR.RED,
                                            borderWidth: 1,
                                            marginHorizontal: 5
                                        }}>
                                        <Text
                                            textLabel={`Jalur ${dataJalur.JALUR}`}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <View style={{alignItems:"center", justifyContent:"center", paddingVertical: 10}}>
                    <TouchableOpacity
                        onPress={()=>{
                            if(this.state.location.latitude && this.state.location.longitude && this.state.location.accuracy <= 30){
                                if(this.state.dataJalur.jalurPatroli.length > 0){
                                    this.props.navigation.navigate("PatroliSession", {jalurPatroli: this.state.dataJalur.jalurPatroli, selectedJalur: this.state.dataJalur.selectedJalur, selectedWerks: this.state.dataJalur.selectedWerks})
                                }
                                else {
                                    alert("Jalur tidak di temukan!");
                                }
                            }
                        }}
                        style={{
                            width: 75,
                            height: 75,
                            borderRadius: 37.5,
                            backgroundColor: this.state.location.latitude && this.state.location.longitude && this.state.location.accuracy <= 30 ? COLOR.RED_1 : COLOR.GREY_2,
                            alignItems:'center',
                            justifyContent:"center",
                            marginTop: 10
                        }}
                        disabled={!(this.state.location.latitude && this.state.location.longitude && this.state.location.accuracy <= 30)}
                    >
                        <Text
                            textColor={COLOR.WHITE}
                            textLabel={"Mulai"}
                        />
                    </TouchableOpacity>
                </View>
                <ModalPilihBA
                    visible={this.state.modalVisible}
                    defaultWerks={this.state.dataJalur.selectedWerks}
                    listBA={this.state.dataJalur.activeWerks}
                    modalAction={(value)=>{
                        let jalurPatroli = patroliController.getJalur(value.WERKS, 1);
                        // coordinate data index[0] per jalur
                        let jalurFirstIndex = patroliController.getNoOfJalur(value.WERKS);
                        this.setState({
                            modalVisible: false,
                            dataJalur: {
                                ...this.state.dataJalur,
                                selectedWerks: value.WERKS,
                                jalurPatroli: jalurPatroli,
                                jalurFirstIndex: jalurFirstIndex
                            },
                            markerFlag: true
                        }, ()=>{
                            setTimeout(()=>{
                                this.setState({
                                    markerFlag: false
                                })
                            }, 1000)
                        })
                    }}
                />
            </View>
        )
    }

    getCurrentLocation(){
        Geolocation.getCurrentPosition(
            (geolocation)=>{
                this.setState({
                    location:{
                        fakeGPS: geolocation.mocked,
                        accuracy: geolocation.coords.accuracy,
                        latitude: geolocation.coords.latitude,
                        longitude: geolocation.coords.longitude
                    }
                })
            },
            (e)=>{
                this.getCurrentLocation();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0, distanceFilter: 1}
        )
    }

}
