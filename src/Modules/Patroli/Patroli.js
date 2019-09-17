import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

import {Header} from '../../UI/Component'
import {Icon} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';

export default class Patroli extends Component{
    constructor(){
        super();

        this.state={
            patroliStatus: false,

            titikapi: 0,

            session:{
                sessionStatus: false,
                sessionName: null
            },

            timer:{
                time: "00:00:00",
                jam: 0,
                menit: 59,
                detik: 55,
            }
        }
    }

    componentDidMount(): void {

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
                            marginVertical: 15
                        }}
                        underlineColorAndroid={COLOR.GREY}
                    />
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                patroliStatus: !this.state.patroliStatus
                            }, ()=>{
                                if (this.state.patroliStatus){
                                    this.timerStart();
                                    this.trackStart();
                                }
                                else {
                                    this.timerStop();
                                    this.trackStop();
                                }
                            })
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
                <View style={{alignItems:"center"}}>
                    <Text style={{textAlign:"center", paddingTop: 10, paddingVertical: 5, paddingHorizontal: 50}} >FILEPATHFILEPATH FILEHFILEILE PATH FILEPATH</Text>
                    <Text style={{textAlign:"center", paddingVertical: 5, paddingHorizontal: 50}} >FILE PATH</Text>
                </View>
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

    trackStart(){
        let trackInterval = setInterval(()=>{
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;
                    alert(latitude.toString()+":"+longitude.toString())
                },
                (error) => {

                },
                {
                    //enableHighAccuracy : aktif highaccuration
                    enableHighAccuracy: false,
                    // timeout : max time to getCurrentLocation
                    timeout: 10000,
                    // maximumAge : using last cache if not get real position
                    maximumAge: 0
                },
            );
        }, 5000);

        this.setState({
            trackInterval
        });
    }
    trackStop(){
        clearInterval(this.state.timerInterval);
    }

    saveSession(){
        let sessionModel = {
            ID: {type: 'string', optional: false},
            NAME: {type: 'string', optional: false},
            INSERT_TIME: {type: 'double', optional: false},
            END_TIME: {type: 'double', optional: false}
        }
    }

    saveCoordinate(sessionID){
        let coordinateModel = {
            ID: {type: 'string', optional: false},
            ID_SESSION: {type: 'string', optional: false},
            LONGITUDE: {type: 'string', optional: false},
            LATITUDE: {type: 'string', optional: false},
            FIRE_STATUS: {type: 'boolean', optional: false},
        }
    }

}
