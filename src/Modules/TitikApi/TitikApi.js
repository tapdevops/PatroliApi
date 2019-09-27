import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import RealmServices from '../../Data/Realm/RealmServices';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

import {HeaderIcon} from "../../UI/Component";

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
        this.getCoordinateTap()
    }

    componentWillUnmount() {}

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    backgroundColor={"red"}
                    textLabel={"Kirim Data"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                    actionIconRight={()=>{

                        this.getCoordinateTap()
                    }}
                    iconSourceRight={"refresh"}
                />
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
            </View>
        )
    }

    // renderMarker(){
    //     this.state.coordinateTap.map((coordinate)=>{
    //         console.log("COOR"+JSON.stringify(coordinate));
    //         return(
    //             <Marker
    //                 title={"POINT 1"}
    //                 description={"desc"}
    //                 coordinate={{
    //                     latitude: -2.9485251903533936,
    //                     longitude: 112.34932708740234
    //                 }}
    //             />
    //         )
    //     })
    // }

    //tarik data coordinate titik api di realm
    async getCoordinateTap(){
        let coordinateTap = RealmServices.query("TABLE_COORDINATE", `FIRE_STATUS = "Y"`);
        if(coordinateTap !== undefined){
            let tempCoordinateTap = [];
            await coordinateTap.map((coordinateModel, index)=>{
                tempCoordinateTap.push({
                    latitude: parseFloat(coordinateModel.LATITUDE),
                    longitude: parseFloat(coordinateModel.LONGITUDE)
                });
                console.log("TEMPCOR",tempCoordinateTap[index]);
                console.log("TEMPCORFLO",parseFloat(-2.9485251903533936));
            });
            this.setState({
                region:{
                    latitude: -2.9541356,
                    longitude: 112.3548889,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                },
                coordinateTap: [...this.state.coordinateTap, ...tempCoordinateTap]
            })
        }
    }

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