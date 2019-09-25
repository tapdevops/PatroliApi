import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';

import RealmServices from '../../Data/Realm/RealmServices';

import {Header} from '../../UI/Component'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';

export default class Patroli extends Component{
    constructor(){
        super();

        this.state={
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

    componentDidMount(): void {
        this.startWatchPosition();
    }

    render(){
        return(
            <View
                style={{
                    flex: 1,
                }}>
                <Header
                    backgroundColor={"red"}
                    textLabel={"Patroli Api"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                />
                <View
                    style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <Text>Nama Saya</Text>
                    <TextInput
                        style={{
                            width: "50%",
                            marginVertical: 15,
                            textAlign: "center"
                        }}
                        value={this.state.userName}
                        onChangeText={(value) => {
                            this.setState({
                                userName: value
                            })
                        }}
                        editable={!this.state.patroliStatus}
                        underlineColorAndroid={COLOR.GREY}
                    />
                    <TouchableOpacity
                        onPress={()=>{
                            if(this.state.userName !== null && this.state.userName !== undefined){
                                if(this.state.location.latitude !== null && this.state.location.longitude !== null){
                                    if(!this.state.location.fakeGPS){
                                        this.sessionStart()
                                    }
                                    else {
                                        alert("Fake gps terdeteksi, tolong matikan terlebih dahulu");
                                    }
                                }
                                else {
                                    alert("Tidak dapat menemukan gps");
                                }
                            }
                            else {
                                alert("Username tidak boleh kosong!");
                            }
                        }}
                        style={{
                            width: "50%",
                            alignItems: "center",
                            backgroundColor: this.state.patroliStatus ? COLOR.GREY : COLOR.RED,
                            paddingVertical: 10,
                            marginVertical: 10,
                            borderRadius: 20
                        }}>
                        <Text
                            style={{
                                color:COLOR.WHITE
                            }}>
                            {this.state.patroliStatus ? "Selesai Patroli":"Mulai Patroli"}
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection:"row",
                        alignItems:'center',
                        justifyContent:"center",
                        width: 100,
                        paddingVertical: 5
                    }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginHorizontal: 5
                            }}
                            source={require('../../Asset/Icon/ic_timer.png')}
                        />
                        <Text style={{flex: 4}}>{this.state.timer.time}</Text>
                    </View>
                    <View style={{
                        flexDirection:"row",
                        alignItems:'center',
                        justifyContent:"center",
                        width: 100,
                        paddingVertical: 5
                    }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginHorizontal: 5
                            }}
                            source={require('../../Asset/Icon/ic_fire_grey.png')}
                        />
                        <Text style={{flex: 4}}>{this.state.titikapi + " Titik Api"}</Text>
                    </View>
                </View>
                <Text style={{alignSelf:"center"}}>Latitude:{this.state.location.latitude}</Text>
                <Text style={{alignSelf:"center"}}>Longitude:{this.state.location.longitude}</Text>
                <View style={{
                    flex: 1.5,
                    alignItems:"center",
                    justifyContent:"center",
                    borderTopWidth: 1,
                    marginHorizontal: 25,
                }}>
                    <TouchableOpacity
                        onPress={()=>{
                            if (this.state.patroliStatus){
                                this.setState({
                                    titikapi: this.state.titikapi + 1
                                },()=>{
                                    this.insertTemuanApi(this.state.patroliSession)
                                })
                            }
                        }}
                        style={{
                            backgroundColor: this.state.patroliStatus ? COLOR.RED : COLOR.GREY,
                            alignItems: "center",
                            justifyContent: "center",
                            width: 125,
                            height: 125,
                            borderRadius: 10
                        }}
                        activeOpacity={this.state.patroliStatus ? 0.2 : 1}
                    >
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                            }}
                            source={require('../../Asset/Icon/ic_fire_white.png')}
                        />
                        <Text style={{color: COLOR.WHITE}}> Ada api disini!</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{alignSelf:"center", color:COLOR.GREY, fontSize: SIZE.TEXT_SMALL, marginBottom: 5}}>V1.1</Text>
            </View>
        )
    }

    timerStart(){
        let timerInterval = setInterval(()=>{
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
        }, 1000);

        this.setState({
            timerInterval,
            timer:{
                ...this.state.timer
            }
        });
    }
    timerStop(){
        clearInterval(this.state.timerInterval);
    }

    sessionStart(){
        this.setState({
            patroliStatus: !this.state.patroliStatus,
            patroliSession: "P"+moment().format("YYYYMMDDHHmmss").toString()
        }, ()=>{
            if (this.state.patroliStatus){
                this.saveSession(this.state.patroliSession);
                this.timerStart();
                this.trackStart(this.state.patroliSession);
            }
            else {
                this.clearSession();
            }
        });
    };

    startWatchPosition(){
        Geolocation.watchPosition(
            (geolocation)=>{
                console.log("HELLO",geolocation);
                this.setState({
                    location:{
                        fakeGPS: geolocation.mocked,
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
    }

    // stopWatchPosition(){
    //     Geolocation.stopObserving();
    // }

    trackStart(sessionID){
        let trackInterval = setInterval(()=>{
            Geolocation.getCurrentPosition(
                geolocation => {
                    this.saveCoordinate(sessionID, geolocation.coords.longitude, geolocation.coords.latitude, "N");
                },
                ((e) => {
                    console.log(e);
                }),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }, 5000);

        this.setState({
            trackInterval
        });
    }
    trackStop(){
        clearInterval(this.state.trackInterval);
    }

    clearSession(){
        // this.stopWatchPosition();
        this.setState({
            patroliStatus: false,
            patroliSession: null,

            userName: null,
            titikapi: 0,


            timer:{
                time: "00:00:00",
                jam: 0,
                menit: 0,
                detik: 0,
            }
        },()=>{
            this.timerStop();
            this.trackStop();
        });
    }

    insertTemuanApi(sessionID){
        if(this.state.patroliStatus){
            Geolocation.getCurrentPosition(
                geolocation => {
                    this.saveCoordinate(sessionID, geolocation.coords.longitude, geolocation.coords.latitude, "Y");
                },
                ((e) => {
                    console.log(e);
                }),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }

    saveSession(sessionID){
        let sessionModel = {
            ID: sessionID.toString(),
            NAME: this.state.userName.toString(),
            INSERT_TIME: parseFloat(moment().format("YYYYMMDDHHmmss"))
        };
        RealmServices.saveData("TABLE_SESSION", sessionModel);
    }

    saveCoordinate(sessionID, longitude, latitude, fireStatus){
        try{
            let coordinateModel = {
                ID: "CR"+moment().format("YYYYMMDDHHmmss"),
                ID_SESSION: sessionID.toString(),
                LONGITUDE: longitude.toString(),
                LATITUDE: latitude.toString(),
                INSERT_TIME: parseFloat(moment().format("YYYYMMDDHHmmss")),
                FIRE_STATUS: fireStatus.toString(),
            };
            if(!this.state.location.fakeGPS){
                RealmServices.saveData("TABLE_COORDINATE", coordinateModel);
            }
            else {
                alert("Fake gps terdeteksi. Session patroli dihentikan!");
                this.clearSession();
            }
        }
        catch (e) {
            alert(e);
        }
    }

}
