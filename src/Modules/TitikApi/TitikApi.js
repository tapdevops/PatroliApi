import React, {Component} from 'react';
import {Image, View, TouchableOpacity, TextInput, FlatList, ScrollView, AppState} from 'react-native';
import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import SlidingUpPanel from 'rn-sliding-up-panel';

import fcmController from '../Controller/FCMController';
import userController from '../Controller/UserController';
import syncController from '../Controller/SyncController';
import BAController from '../Controller/BAController';
import titikapiController from './Controller/TitikApiController';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";
import {windowHeight, windowWidth} from "../../Data/Constant/Screen";

import {Icon, Text} from "../../UI/Widgets";
import {Header} from "../../UI/Component";
import {ModalLoading} from "../../UI/Modal";
import GeoJSON from '../../Data/GeoJSON';
import Geolocation from "@react-native-community/geolocation";

export default class TitikApi extends Component{
    constructor(){
        super();
        this.state={
            modalLoading: false,

            coordinateTitikApi:[],
            coordinateTitikPanas:[],
            region:{
                latitude: -6.229196,
                longitude: 106.825527,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            activeBA:[],
            filterKeyword: null,
            filterTitikApi: [],
            showFilter:{
                titikApi: true,
                titikPanasMerah: false,
                titikPanasOrange: false,
                titikPanasKuning: false,
                filterWerks: [],
                selectedPolygon: ""
            },
            polygonCoordinate:[]
        };
    }

    async componentDidMount(): void {

        AppState.addEventListener('change', async (nextAppState) => {
            if(nextAppState === "active"){
                await this.deeplinkSetup();
            }
        });

        this.setState({
            modalLoading: true
        }, async ()=>{
            await fcmController.updateTokenFCM();
            await syncController.downloadTitikApi();
            await this.getFilterBA();
            await this.getCoordinateTitikApi();
            await this.setState({
                modalLoading: false
            })
        });

        this.didFocus = this.props.navigation.addListener(
            'focus',
            async ()=>{
                // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                await this.getFilterBA();
                this.getCoordinateTitikApi();
                // this.getCoordinateTitikPanas();
            }
        );
    }

    async focusCurrentPosition(){
        await Geolocation.getCurrentPosition(
            (geolocation)=>{
                this.MapView.animateCamera(
                    {
                        "center": {
                            "latitude": geolocation.coords.latitude,
                            "longitude": geolocation.coords.longitude
                        },
                        "heading": 0,
                        "pitch": 0,
                        "zoom": 12.658798217773438
                    },{
                        duration: 1000
                    }
                );
            },
            (e)=>{
                this.focusCurrentPosition();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0, distanceFilter: 1}
        );
    }

    async deeplinkSetup(){
        let fcmData = await fcmController.notificationCloseListener();
        if(fcmData === null){
            fcmData = await fcmController.notificationBackgroundListener();
        }

        if(fcmData && fcmData.DEEPLINK === "history"){
            setTimeout(()=>{
                this.MapView.animateCamera(
                    {
                        "center": {
                            "latitude": parseFloat(fcmData.LAT),
                            "longitude": parseFloat(fcmData.LONG)
                        },
                        "heading": 0,
                        "pitch": 0,
                        "zoom": 12.658798217773438
                    },{
                        duration: 1000
                    }
                )
            }, 500);
        }
    }

    async getFilterBA(){
        let listBA = [];
        let selectedBA = [];

        if(userController.isUserAuthorized()){
            listBA = BAController.getAllBA();
            for(let counter = 0; counter < listBA.length; counter ++){
                selectedBA.push(listBA[counter].WERKS);
            }
        }
        else {
            listBA = titikapiController.getActiveBA();
            for(let counter = 0; counter < listBA.length; counter ++){
                selectedBA.push(listBA[counter].WERKS);
            }
        }

        await this.setState({
            activeBA: listBA,
            showFilter:{
                ...this.state.showFilter,
                filterWerks: selectedBA
            }
        })
    }

    async getCoordinateTitikApi(){
        let titikapiArray = await titikapiController.getTitikApiByWerks(this.state.showFilter.filterWerks);
        this.setState({
            coordinateTitikApi: titikapiArray
        })
    }

    async getPolygon(werksCode){
        let polygonArray = [];
        console.log(werksCode);
        await Promise.all(
            GeoJSON[`BA${werksCode}`].features.map(async (geoData)=>{
                let polygonData = {
                    blockName: geoData.properties.BLOCK_NAME,
                    coordinate: [],
                    centerCoordinate: {},
                };
                await Promise.all(
                    geoData.geometry.coordinates[0].map((polygonCoordinate)=>{
                        polygonData.coordinate.push({
                            latitude: polygonCoordinate[1],
                            longitude: polygonCoordinate[0]
                        })
                    })
                );
                polygonArray.push(polygonData);
            })
        );

        this.setState({
            polygonCoordinate: polygonArray
        })
    }

    centerCoordinate(coordinates) {
        let x = coordinates.map(c => c.latitude)
        let y = coordinates.map(c => c.longitude)

        let minX = Math.min.apply(null, x)
        let maxX = Math.max.apply(null, x)

        let minY = Math.min.apply(null, y)
        let maxY = Math.max.apply(null, y)

        return {
            latitude: (minX + maxX) / 2,
            longitude: (minY + maxY) / 2
        }
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    textLabel={"Lokasi Laporan"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={"transparent"}
                />
                <View style={{flex: 1}}>
                    <MapView
                        ref={(MapView)=>{this.MapView = MapView}}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        showsMyLocationButton={false}
                        style={{flex: 1}}
                        mapType={"satellite"}
                        showsUserLocation={true}
                        initialRegion={this.state.region}
                        onMapReady={async ()=>{
                            await this.focusCurrentPosition();
                        }}
                    >
                        {
                            this.state.showFilter.titikApi &&
                            this.state.coordinateTitikApi.map((coordinate, index)=>{
                                return(
                                    <Marker
                                        key={index}
                                        tracksViewChanges={false}
                                        title={"Titik Api TAP"}
                                        coordinate={{
                                            latitude: coordinate.LATITUDE,
                                            longitude: coordinate.LONGITUDE
                                        }}
                                        onPress={()=>{
                                            this.props.navigation.navigate("TitikApiPenanganan", {titikApiParent: coordinate});
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
                        {
                            this.state.polygonCoordinate.map((polygonCoordinate, index)=>{
                                return(
                                    <View key={index}>
                                        <Polygon
                                            key={`poly${index}`}
                                            coordinates={polygonCoordinate.coordinate}
                                            fillColor="rgba(0, 200, 0, 0.5)"
                                            strokeColor="rgba(255,255,255,1)"
                                            strokeWidth={2}
                                            tappable={true}
                                        />
                                        <Marker
                                            key={`marker${index}`}
                                            coordinate={this.centerCoordinate(polygonCoordinate.coordinate)}
                                            tracksViewChanges={false}>
                                            <Text
                                                textColor={COLOR.WHITE}
                                                textSize={SIZE.TEXT_MEDIUM}
                                                textFontFamily={"BOLD"}
                                                key={`markerText${index}`}
                                                textLabel={polygonCoordinate.blockName}
                                            />
                                        </Marker>
                                    </View>
                                )
                            })
                        }
                        {
                            this.state.coordinateTitikPanas.map((coordinate, index)=>{
                                return(
                                    <Marker
                                        key={index}
                                        tracksViewChanges={false}
                                        title={"Titik Api TAP"}
                                        coordinate={{
                                            latitude: coordinate.latitude,
                                            longitude: coordinate.longitude
                                        }}
                                        onPress={()=>{
                                            this.props.navigation.navigate("TitikApiUpdateForm")
                                        }}
                                    >
                                        <Image
                                            style={{width: 20, height: 20}}
                                            source={require('../../Asset/Icon/ic_location_nasa.png')}
                                        />
                                    </Marker>
                                )
                            })
                        }
                    </MapView>
                    <View style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute"
                    }}>
                        <View style={{marginTop: 20, marginHorizontal: 20, backgroundColor:"white", borderRadius: 5}}>
                            <TextInput
                                style={{padding: 0, margin: 0, paddingHorizontal: 10, paddingVertical: 10}}
                                value={this.state.filterKeyword}
                                onChangeText={(value) => {
                                    this.setState({
                                        filterKeyword: value,
                                        filterTitikApi: titikapiController.findTitikApiBasedOnLocation(value)
                                    })
                                }}
                                placeholder={"Cari lokasi laporan"}
                            />
                        </View>
                        {
                            this.state.filterTitikApi.length > 0 &&
                            this.state.filterKeyword !== "" &&
                            <View style={{backgroundColor:"white", borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginHorizontal: 20}}>
                                <FlatList
                                    style={{marginVertical: 5, maxHeight: 85}}
                                    data={this.state.filterTitikApi}
                                    extraData={this.state}
                                    removeClippedSubviews={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({item, index}) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    this.setState({
                                                        filterKeyword: "",
                                                        filterTitikApi: []
                                                    },()=>{
                                                        this.MapView.animateCamera(
                                                            {
                                                                "center": {
                                                                    "latitude": item.LATITUDE,
                                                                    "longitude": item.LONGITUDE
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
                                                style={{paddingVertical: 5, paddingHorizontal: 10}}>
                                                <Text
                                                    textLabel={item.LOKASI}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        }
                        <View style={{alignItems:"flex-end", paddingHorizontal: 20, paddingTop: 5}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this._panel.show()
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    borderWidth: 1,
                                    borderColor: "transparent",
                                    backgroundColor: COLOR.WHITE,
                                    alignItems:'center',
                                    justifyContent:"center",
                                    margin: 10
                                }}
                            >
                                <Image
                                    style={{width: 35, height: 35}}
                                    source={require('../../Asset/Icon/ic_layers.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: "100%",
                            flexDirection:"row",
                            position:"absolute",
                            bottom: 0,
                            justifyContent:"space-between"
                        }}>
                            <View style={{
                                alignSelf: 'flex-start',
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
                                        source={require('../../Asset/Logo/apps_logo.png')}
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
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate("TitikApiManualForm");
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    borderWidth: 1,
                                    borderColor: "transparent",
                                    backgroundColor: COLOR.RED_1,
                                    alignSelf:"center",
                                    alignItems:'center',
                                    justifyContent:"center",
                                    margin: 10
                                }}
                            >
                                <Icon
                                    iconName={"add"}
                                    iconColor={COLOR.WHITE}
                                    iconSize={40}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async ()=>{
                        let result = await syncController.downloadTitikApi();
                        if(result){
                            alert("download titikApi berhasil");
                        }
                        else {
                            alert("download titikApi gagal");
                        }
                    }}
                    style={{
                        flexDirection:"row",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COLOR.RED_1
                    }}>
                    <Icon
                        style={{paddingRight: 5}}
                        iconName={"refresh"}
                        iconSize={SIZE.ICON_MEDIUM}
                        iconColor={COLOR.WHITE}
                    />
                    <Text
                        textColor={COLOR.WHITE}
                        textLabel={"Klik disini untuk memperbarui data. Anda harus terhubung jaringan."}
                        textSize={SIZE.TEXT_SMALL_MIN_1}
                    />
                </TouchableOpacity>
                <ModalLoading
                    show={this.state.modalLoading}
                />
                <SlidingUpPanel
                    ref={c => this._panel = c}
                    minimumVelocityThreshold={1}
                    friction={0.7}
                    draggableRange={{
                        top: windowHeight*0.75,
                        bottom: 0
                    }}
                >
                    <View style={{flex: 1, backgroundColor:COLOR.WHITE, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 15}}>
                        <View style={{paddingHorizontal: 20}}>
                            <Text
                                style={{paddingVertical: 10}}
                                textColor={COLOR.RED_1}
                                textLabel={"Pilih tipe data yang ingin di tampilkan"}
                            />
                            <View
                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            showFilter:{
                                                ...this.state.showFilter,
                                                titikApi: !this.state.showFilter.titikApi
                                            }
                                        })
                                    }}
                                >
                                    <Icon
                                        iconSize={20}
                                        iconName={this.state.showFilter.titikApi ? "check-box" : "check-box-outline-blank"}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{paddingLeft: 5}}
                                    textLabel={"Titik Api"}
                                />
                            </View>
                            {/*<View
                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            showFilter:{
                                                ...this.state.showFilter,
                                                titikPanasMerah: !this.state.showFilter.titikPanasMerah
                                            }
                                        })
                                    }}
                                >
                                    <Icon
                                        iconSize={20}
                                        iconName={this.state.showFilter.titikPanasMerah ? "check-box" : "check-box-outline-blank"}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{paddingLeft: 5}}
                                    textLabel={"Titik panas kategori BAHAYA (Merah)"}
                                />
                            </View>
                            <View
                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            showFilter:{
                                                ...this.state.showFilter,
                                                titikPanasOrange: !this.state.showFilter.titikPanasOrange
                                            }
                                        })
                                    }}
                                >
                                    <Icon
                                        iconSize={20}
                                        iconName={this.state.showFilter.titikPanasOrange ? "check-box" : "check-box-outline-blank"}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{paddingLeft: 5}}
                                    textLabel={"Titik panas kategori WASPADA (Orange)"}
                                />
                            </View>
                            <View
                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            showFilter:{
                                                ...this.state.showFilter,
                                                titikPanasKuning: !this.state.showFilter.titikPanasKuning
                                            }
                                        })
                                    }}
                                >
                                    <Icon
                                        iconSize={20}
                                        iconName={this.state.showFilter.titikPanasKuning ? "check-box" : "check-box-outline-blank"}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{paddingLeft: 5}}
                                    textLabel={"Titik panas kategori PERHATIAN (Kuning)"}
                                />
                            </View>*/}
                        </View>
                        <View style={{paddingHorizontal: 20, flex: 1, maxHeight: windowHeight*0.25}}>
                            <Text
                                style={{paddingVertical: 10}}
                                textColor={COLOR.RED_1}
                                textLabel={"Filter Bisnis Area"}
                            />
                            <ScrollView>
                                {
                                    this.state.activeBA.map((baData, index)=>{
                                        return(
                                            <View
                                                key={index}
                                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                                            >
                                                <TouchableOpacity
                                                    onPress={()=>{
                                                        let tempArray = this.state.showFilter.filterWerks;
                                                        if(tempArray.includes(baData.WERKS)){
                                                            tempArray = tempArray.filter(item => item !== baData.WERKS);
                                                        }
                                                        else {
                                                            tempArray.push(baData.WERKS);
                                                        }
                                                        this.setState({
                                                            showFilter:{
                                                                ...this.state.showFilter,
                                                                filterWerks: tempArray
                                                            }
                                                        }, ()=>{this.getCoordinateTitikApi()})
                                                    }}
                                                >
                                                    <Icon
                                                        iconSize={20}
                                                        iconName={this.state.showFilter.filterWerks.includes(baData.WERKS) ? "check-box" : "check-box-outline-blank"}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{paddingLeft: 5}}
                                                    textLabel={`${baData.WERKS} - ${baData.EST_NAME}`}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View style={{paddingHorizontal: 20, flex: 1, maxHeight: windowHeight*0.25, marginBottom: 5}}>
                            <Text
                                style={{paddingVertical: 10}}
                                textColor={COLOR.RED_1}
                                textLabel={"Map Poligon"}
                            />
                            <ScrollView>
                                {
                                    userController.isUserAuthorized() &&
                                    this.state.activeBA.map((baData, index)=>{
                                        return(
                                            <View
                                                key={index}
                                                style={{flexDirection:"row", padding: 5, alignItems:"center"}}
                                            >
                                                <TouchableOpacity
                                                    onPress={async ()=>{
                                                        await this.getPolygon(baData.WERKS);
                                                        this.setState({
                                                            showFilter:{
                                                                ...this.state.showFilter,
                                                                selectedWerks: baData.WERKS
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <Icon
                                                        iconSize={20}
                                                        iconName={this.state.showFilter.selectedWerks === baData.WERKS ? "check-box" : "check-box-outline-blank"}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{paddingLeft: 5}}
                                                    textLabel={`${baData.WERKS} - ${baData.EST_NAME}`}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }
}