import React, {Component} from 'react';
import {Image, View} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import {HeaderIcon} from '../../UI/Component'
import {Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import patroliController from "../Patroli/Controller/PatroliController";
import titikapiController from "../TitikApi/Controller/TitikApiController";

export default class PatroliHistoryDetail extends Component{
    constructor(props){
        super(props);
        let jalurPatroli = patroliController.getJalur(props.route.params.patroliData.WERKS, props.route.params.patroliData.JALUR);
        let jalurPetugasPatroli = patroliController.getJalurCoordinate(props.route.params.patroliData.ID);
        this.state={
            markerFlag: true,
            continueVisible: false,
            map:{
                region:{
                    latitude: -6.229196,
                    longitude: 106.825527,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            },
            jalurPatroli: jalurPatroli,
            jalurPetugasPatroli: jalurPetugasPatroli,
            patroliData: props.route.params.patroliData,
            titikApiData: titikapiController.getTitikApiBySession(props.route.params.patroliData.ID)
        }
    }

    componentDidMount(): void {
        setTimeout(()=>{
            this.setState({
                markerFlag: false
            })
        }, 100)
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    textLabel={"Patroli Api"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={COLOR.GREY}
                    iconLeftSource={"keyboard-arrow-left"}
                    iconLeftSize={SIZE.ICON_LARGE+30}
                    iconLeftAction={()=>{this.props.navigation.pop()}}
                />
                <View style={{flex: 1}}>
                    <MapView
                        ref={(ref)=>{this.MapView = ref}}
                        provider={PROVIDER_GOOGLE}
                        style={{flex: 1}}
                        mapType={"satellite"}
                        initialRegion={this.state.map.region}
                        showsMyLocationButton={false}
                        onMapReady={()=>{
                            if(this.state.jalurPetugasPatroli.length > 0){
                                setTimeout(()=>{
                                    this.MapView.animateCamera(
                                        {
                                            "center": {
                                                "latitude": this.state.jalurPetugasPatroli[0].latitude,
                                                "longitude": this.state.jalurPetugasPatroli[0].longitude
                                            },
                                            "heading": 0,
                                            "pitch": 0,
                                            "zoom": 12.658798217773438
                                        },{
                                            duration: 1000
                                        }
                                    )
                                }, 300);
                            }
                        }}
                    >
                        <Polyline
                            coordinates={this.state.jalurPatroli}
                            strokeColor="white" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />
                        <Polyline
                            coordinates={this.state.jalurPetugasPatroli}
                            strokeColor="yellow" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />
                        <Marker
                            tracksViewChanges={this.state.markerFlag}
                            coordinate={{
                                latitude: this.state.jalurPatroli[this.state.jalurPatroli.length-1].latitude,
                                longitude: this.state.jalurPatroli[this.state.jalurPatroli.length-1].longitude
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
                                latitude: this.state.jalurPatroli[0].latitude,
                                longitude: this.state.jalurPatroli[0].longitude
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
                        {
                            this.state.titikApiData.map((coordinate, index)=>{
                                return(
                                    <Marker
                                        key={index}
                                        tracksViewChanges={false}
                                        coordinate={{
                                            latitude: coordinate.LATITUDE,
                                            longitude: coordinate.LONGITUDE
                                        }}
                                    >
                                        <Image
                                            style={{width: 20, height: 20}}
                                            source={require('../../Asset/Logo/apps_logo.png')}
                                        />
                                    </Marker>
                                )
                            })
                        }
                    </MapView>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"DURASI PATROLI"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.patroliData.duration}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_LARGE}
                            />
                        </View>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"JARAK (KM)"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.patroliData.jarak/1000}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_LARGE}
                            />
                        </View>
                    </View>
                    <View
                        style={{height : 1, borderBottomWidth: 1, borderColor: COLOR.GREY, marginHorizontal: 25}}
                    />
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 15}}>
                            <Text
                                textLabel={"CHECKPOINTS"}
                                textSize={SIZE.TEXT_SMALL}
                            />
                            <Text
                                textLabel={this.state.patroliData.checkpoint}
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
                                textLabel={this.state.patroliData.titikApi}
                                textFontFamily={"BOLD"}
                                textSize={SIZE.TEXT_LARGE}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}
