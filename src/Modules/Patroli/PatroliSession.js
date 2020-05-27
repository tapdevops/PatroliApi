import React, {Component} from 'react';
import {DeviceEventEmitter, Image, NativeModules, TouchableOpacity, View, BackHandler, NativeEventEmitter} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import {getDistance} from 'geolib';

import RealmServices from '../../Data/Realm/RealmServices';
import patroliController from './Controller/PatroliController';

import {Header, Alert} from '../../UI/Component'
import {Icon, Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";

export default class PatroliSession extends Component{
    constructor(props){
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
            patroliStatus: false,
            patroliSession: null,

            userName: "test",
            titikapi: 0,

            location:{
                fakeGPS: false,
                latitude: 0,
                longitude: 0
            },

            timer:{
                time: "00:00:00",
                jam: 0,
                menit: 0,
                detik: 0,
            },

            dataJalur:{
                selectedWerks: props.route.params.selectedWerks ? props.route.params.selectedWerks : null,
                selectedJalur: props.route.params.selectedJalur ? props.route.params.selectedJalur.toString() : null,
                currentJalur: [],
                totalDistanceJalur: 0,
                jalurPatroli: props.route.params.jalurPatroli ? props.route.params.jalurPatroli : []
            },

            watchID: null,
            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            },
            nativeGPS:{
                latitude: 0,
                longitude: 0,
                accuracy: 0,
                satelliteCount: 0,
            },
        }
    }

    async componentDidMount(): void {
        this.nativeGps();
        this.startWatchPosition();
        this.startServiceListener();
        this.sessionStart();
        setTimeout(()=>{
            this.setState({
                markerFlag: false
            })
        }, 1000)
        this.didFocus = this.props.navigation.addListener(
            'focus',
            ()=>{
                BackHandler.addEventListener('hardwareBackPress', ()=>this.backHandler());
                this.setState({
                    titikapi: patroliController.getTitikApiCount(this.state.patroliSession)
                });
            }
        );
    }

    componentWillUnmount(): void {
        BackHandler.removeEventListener("hardwareBackPress", ()=>this.backHandler());
    }

    backHandler(){
        this.setState({
            alertModal: {
                ...this.state.alertModal,
                visible: true,
                title: "Patroli sedang berjalan",
                description: "Selesaikan patroli untuk kembali ke halaman utama!"
            }
        });
        return true;
    }

    calculateJarak(firstPoint, secondPoint){
        let getTrackDistance = getDistance(firstPoint,secondPoint);
        return getTrackDistance;
    }

    nativeGps(){
        const eventEmitter = new NativeEventEmitter(NativeModules.Satellite);
        eventEmitter.addListener('getSatellite', (event) => {
            this.setState({
                nativeGPS:{
                    longitude: event.longitude,
                    latitude: event.latitude,
                    accuracy: event.accuracy,
                    satelliteCount: Math.floor(event.satelliteCount)
                }
            })
        });
        NativeModules.Satellite.getCoors();
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
                <View style={{flex: 1}}>
                    <MapView
                        ref={(MapView)=>{this.MapView = MapView}}
                        provider={PROVIDER_GOOGLE}
                        style={{flex: 1}}
                        mapType={"satellite"}
                        showsMyLocationButton={false}
                        showsUserLocation={true}
                        initialRegion={this.state.map.region}
                        onMapReady={()=>{
                            this.nativeGps();
                            this.MapView.animateCamera(
                                {
                                    "center": {
                                        "latitude": this.state.dataJalur.jalurPatroli[0].latitude,
                                        "longitude": this.state.dataJalur.jalurPatroli[0].longitude
                                    },
                                    "heading": 0,
                                    "pitch": 0,
                                    "zoom": 12.658798217773438
                                },{
                                    duration: 1000
                                }
                            )
                        }}
                    >
                        <Polyline
                            coordinates={this.state.dataJalur.jalurPatroli}
                            strokeColor="white" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />
                        <Polyline
                            coordinates={this.state.dataJalur.currentJalur}
                            strokeColor="yellow" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />
                        <Marker
                            tracksViewChanges={this.state.markerFlag}
                            coordinate={{
                                latitude: this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].latitude,
                                longitude: this.state.dataJalur.jalurPatroli[this.state.dataJalur.jalurPatroli.length-1].longitude
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
                                latitude: this.state.dataJalur.jalurPatroli[0].latitude,
                                longitude: this.state.dataJalur.jalurPatroli[0].longitude
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
                    </MapView>
                    <View style={{position:"absolute", width: "100%", height: "100%"}}>
                        <TouchableOpacity
                            style={{
                                alignSelf:"flex-end"
                            }}
                            onPress={()=>{
                                this.MapView.animateCamera(
                                    {
                                        "center": {
                                            "latitude": this.state.location.latitude,
                                            "longitude": this.state.location.longitude
                                        },
                                        "heading": 0,
                                        "pitch": 0,
                                        "zoom": 12.658798217773438
                                    },{
                                        duration: 1000
                                    }
                                )
                            }}
                        >
                            <Icon
                                style={{
                                    margin: 10,
                                    padding: 10,
                                    backgroundColor:COLOR.WHITE,
                                    borderRadius: 25,
                                    alignItems:"center"
                                }}
                                iconName= {"gps-fixed"}
                                iconSize={20}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    paddingVertical: 15
                }}>
                    <View style={{
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text
                            textLabel={"DURASI PATROLI"}
                            textSize={SIZE.TEXT_SMALL}
                        />
                        <Text
                            textLabel={this.state.timer.time}
                            textSize={SIZE.TEXT_LARGE}
                            textFontFamily={"BOLD"}
                        />
                    </View>
                    <View style={{flexDirection: "row", marginHorizontal: 25}}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"JARAK (KM)"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.dataJalur.totalDistanceJalur/1000}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_LARGE}
                            />
                        </View>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"TITIK API"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.titikapi}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_LARGE}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"SATELLITE"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.nativeGPS.satelliteCount}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                        </View>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"LATITUDE"}
                                textSize={SIZE.TEXT_SMALL}
                            />

                            <Text
                                textLabel={this.state.location.latitude.toFixed(7)}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                        </View>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"LONGITUDE"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.location.longitude.toFixed(7)}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection:"row", alignItems:'center', justifyContent:"center"}}>
                        <TouchableOpacity
                            onPress={()=>{
                                BackHandler.removeEventListener("hardwareBackPress", ()=>this.backHandler());
                                this.props.navigation.navigate("PatroliApiForm", {
                                    patroliSession: this.state.patroliSession,
                                    location:{
                                        latitude: this.state.location.latitude,
                                        longitude: this.state.location.longitude
                                    },
                                    selectedWerks: this.state.dataJalur.selectedWerks,
                                    selectedJalur: this.state.dataJalur.selectedJalur
                                });
                            }}
                            style={{
                                width: 75,
                                height: 75,
                                borderRadius: 37.5,
                                borderWidth: 1,
                                alignItems:'center',
                                justifyContent:"center",
                                margin: 10
                            }}>
                            <Image
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                                source={require('../../Asset/Icon/ic_fire_red.png')}
                                resizeMode={"stretch"}
                            />
                            <Text
                                textLabel={"Ada api"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                patroliController.updateSessionPatroli(this.state.patroliSession, this.state.dataJalur.totalDistanceJalur, this.state.timer.time);
                                this.sessionClear();
                                this.props.navigation.popToTop();
                            }}
                            style={{
                                width: 75,
                                height: 75,
                                borderRadius: 37.5,
                                backgroundColor:COLOR.RED_1,
                                alignItems:'center',
                                justifyContent:"center",
                                margin: 10
                            }}>
                            <Text
                                textColor={COLOR.WHITE}
                                textLabel={"Selesai"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Alert
                    action={()=>{this.setState({
                        alertModal: {...this.state.alertModal, visible: false}
                    })}}
                    visible={this.state.alertModal.visible}
                    alertTitle={this.state.alertModal.title}
                    alertDescription={this.state.alertModal.description}
                />
            </View>
        )
    }

    startServiceListener(){
        NativeModules.LocationService.stopService();
        DeviceEventEmitter.addListener('LOCATIONSERVICE', () => {
            this.timerStart();
            if(this.state.patroliStatus && parseInt(this.state.timer.detik) % 5 === 0){
                Geolocation.getCurrentPosition(
                    geolocation => {
                        let lastCoordinate = this.state.dataJalur.currentJalur.length > 0 ? this.state.dataJalur.currentJalur[this.state.dataJalur.currentJalur.length-1] : null;
                        let tempDistance = this.state.dataJalur.totalDistanceJalur;
                        if(lastCoordinate){
                            tempDistance += this.calculateJarak({latitude: geolocation.coords.latitude, longitude: geolocation.coords.longitude}, lastCoordinate);
                        }

                        this.setState({
                            dataJalur: {
                                ...this.state.dataJalur,
                                totalDistanceJalur: tempDistance,
                                currentJalur: [...this.state.dataJalur.currentJalur, {latitude: geolocation.coords.latitude, longitude: geolocation.coords.longitude}]
                            }
                        });
                        this.saveCoordinate(this.state.patroliSession, geolocation.coords.longitude, geolocation.coords.latitude);
                    },
                    ((e) => {
                        console.log(e);
                    }),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }
        });
    }

    timerStart(){
        let detik = parseInt(this.state.timer.detik) + 1;
        let menit = parseInt(this.state.timer.menit);
        let jam = parseInt(this.state.timer.jam);

        if (detik === 60) {
            menit = menit + 1;
            detik = 0;
        }

        if(parseInt(menit) === 60){
            jam = jam + 1;
            menit = 0;
        }

        let labelDetik = detik < 10 ? `0${detik.toString()}` : detik.toString();
        let labelMenit = menit < 10 ? `0${menit.toString()}` : menit.toString();
        let labelJam = jam < 10 ? `0${jam.toString()}` : jam.toString();
        this.setState({
            timer:{
                time: `${labelJam}:${labelMenit}:${labelDetik}`,
                jam: jam,
                menit: menit,
                detik: detik,
            }
        });
    }

    sessionStart(){
        this.setState({
            patroliStatus: true,
            patroliSession: `${moment().format("YYYYMMDDHHmmss")}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`
        }, ()=>{
            if (this.state.patroliStatus){
                let patroliSessionData = {
                    sessionID: this.state.patroliSession,
                    selectedWerks: this.state.dataJalur.selectedWerks,
                    selectedJalur: this.state.dataJalur.selectedJalur,
                    duration: this.state.timer.time
                }
                patroliController.savePatroliSession(patroliSessionData);
                NativeModules.LocationService.startService();
            }
            else {
                this.sessionClear();
            }
        });
    };

    startWatchPosition(){
        this.setState({
            watchID: Geolocation.watchPosition(
                (geolocation)=>{
                    this.setState({
                        location:{
                            fakeGPS: false,
                            latitude: geolocation.coords.latitude,
                            longitude: geolocation.coords.longitude
                        }
                    })
                },
                (e)=>{
                    this.startWatchPosition();
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0, distanceFilter: 1}
            )
        })
    }

    sessionClear(){
        // this.stopWatchPosition();
        NativeModules.LocationService.stopService();
        Geolocation.clearWatch(this.state.watchID);
        this.setState({
            patroliStatus: false,

            userName: null,
            titikapi: 0,

            timer:{
                time: "00:00:00",
                jam: 0,
                menit: 0,
                detik: 0,
            }
        });
    }

    insertTemuanApi(){
        if(this.state.patroliStatus){
            Geolocation.getCurrentPosition(
                geolocation => {
                    this.saveCoordinate(this.state.patroliSession, geolocation.coords.longitude, geolocation.coords.latitude);
                },
                ((e) => {
                    console.log(e);
                }),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }

    // saveSession(sessionID){
    //     let sessionModel = {
    //         ID: sessionID.toString(),
    //         NAME: ,
    //         INSERT_TIME: parseFloat(moment().format("YYYYMMDDHHmmss"))
    //     };
    //     RealmServices.saveData("TABLE_SESSION", sessionModel);
    // }

    saveCoordinate(sessionID, longitude, latitude){
        let coordinateModel = {
            ID: "CR"+moment().format("YYYYMMDDHHmmss"),
            ID_SESSION: sessionID.toString(),
            LONGITUDE: parseFloat(longitude),
            LATITUDE: parseFloat(latitude),
            INSERT_TIME: moment().format("YYYYMMDDHHmmss")
        };
        if(!this.state.location.fakeGPS){
            RealmServices.saveData("TABLE_TRACK", coordinateModel);
        }
        else {
            alert("Fake gps terdeteksi. Session patroli dihentikan!");
            this.sessionClear();
        }
    }

}
