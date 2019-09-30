import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import RealmServices from '../../Data/Realm/RealmServices';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

import {HeaderIcon} from "../../UI/Component";
import Geolocation from "@react-native-community/geolocation";

export default class TitikApi extends Component{
    constructor(){
        super();
        this.state={
            coordinateTap:[],
            coordinateAPI:[],
            region:{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }
        };
    }

    componentDidMount(): void {
        this.didFocus = this.props.navigation.addListener(
            'didFocus',
            ()=>{
                this.getCoordinateTap();
            }
        );
    }

    componentWillUnmount() {
        this.didFocus.remove();
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    backgroundColor={"red"}
                    textLabel={"Titik Api"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                    actionIconRight={()=>{
                        this.getCoordinateTap()
                    }}
                    iconSourceRight={"refresh"}
                />
                <View style={{flex: 1}}>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={{flex: 1}}
                        mapType={"satellite"}
                        showsUserLocation={true}
                        region={this.state.region}>
                        {
                            this.state.coordinateTap.map((coordinate)=>{
                                return(
                                    <Marker
                                        title={"Titik Api TAP"}
                                        coordinate={{
                                            latitude: coordinate.latitude,
                                            longitude: coordinate.longitude
                                        }}>
                                        <Image
                                            style={{width: 20, height: 20}}
                                            source={require('../../Asset/Icon/ic_location_tap.png')}
                                        />
                                    </Marker>
                                )
                            })
                        }
                    </MapView>
                    <View style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        alignItems: "flex-end",
                        justifyContent: "flex-end"
                    }}>
                        <View style={{
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: "rgba(0,0,0,0.3)"
                        }}>
                            <Text style={{
                                color:COLOR.WHITE,
                                paddingBottom: 5
                            }}>
                                Keterangan :
                            </Text>
                            <View style={{
                                flexDirection: "row",
                                alignItems:"center"
                            }}>
                                <Image
                                    style={{width: 20, height: 20}}
                                    source={require('../../Asset/Icon/ic_location_tap.png')}
                                />
                                <Text style={{
                                    fontSize: SIZE.TEXT_SMALL,
                                    color:COLOR.WHITE
                                }}>
                                    Titik Api Berdasarkan Info Patroli Api
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                alignItems:"center"
                            }}>
                                <Image
                                    style={{width: 20, height: 20}}
                                    source={require('../../Asset/Icon/ic_location_nasa.png')}
                                />
                                <Text style={{
                                    fontSize: SIZE.TEXT_SMALL,
                                    color:COLOR.WHITE
                                }}>
                                    Titik Api Berdasarkan Info NASA
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/*<View*/}
                {/*    style={{*/}
                {/*        height: 40,*/}
                {/*        alignItems: "center",*/}
                {/*        justifyContent: "center",*/}
                {/*        backgroundColor: "yellow"*/}
                {/*    }}>*/}
                {/*    <Text*/}
                {/*        style={{*/}
                {/*            color: COLOR.GREY,*/}
                {/*            textAlign: "center"*/}
                {/*        }}>*/}
                {/*        {"Klik disini untuk memperbarui data. Kamu harus terhubung jaringan."}*/}
                {/*    </Text>*/}
                {/*</View>*/}
            </View>
        )
    }


    //tarik data coordinate titik api di realm
    async getCoordinateTap(){
        let coordinateTap = RealmServices.query("TABLE_COORDINATE", `FIRE_STATUS = "Y"`);
        if(coordinateTap !== undefined){
            let tempCoordinateTap = [];

            await Geolocation.getCurrentPosition(
                geolocation => {
                    this.setState({
                        region:{
                            latitude: geolocation.coords.latitude,
                            longitude: geolocation.coords.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }
                    })
                },
                ((e) => {
                    console.log(e);
                }),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );

            await coordinateTap.map((coordinateModel, index)=>{
                tempCoordinateTap.push({
                    latitude: parseFloat(coordinateModel.LATITUDE),
                    longitude: parseFloat(coordinateModel.LONGITUDE)
                });
            });
            this.setState({
                coordinateTap: [...this.state.coordinateTap, ...tempCoordinateTap]
            })
        }
    }

    //tarik data coordinate titik api NASA
    async getCoordinateNasa(){
        let coordinateTap = RealmServices.query("TABLE_COORDINATE", `FIRE_STATUS = "Y"`);
        if(coordinateTap !== undefined){
            let tempCoordinateTap = [];
            await coordinateTap.map((coordinateModel)=>{
                tempCoordinateTap.push({
                    latitude: coordinateModel.LATITUDE,
                    longitude: coordinateModel.LONGITUDE
                })
            });
            this.setState({
                coordinateTap: [...this.state.coordinateTap, ...tempCoordinateTap]
            })
        }
    }
}
