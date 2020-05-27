import React, {Component} from 'react';
import {Image, FlatList, TouchableOpacity, View, ScrollView} from 'react-native';
import moment from 'moment';

import titikapiController from './Controller/TitikApiController';

import {HeaderIcon} from '../../UI/Component'
import {Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";

export default class TitikApiPenanganan extends Component{
    constructor(props){
        super(props);

        this.state={
            statusTitikApi : false,
            titikApiParent: props.route.params.titikApiParent,
            titikApiDetail: [],
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
            }
        }
    }

    async componentDidMount(): void {
        this.didFocus = this.props.navigation.addListener(
            'focus',
            ()=>{
                this.getTitikApiDetail();
                this.setState({
                    statusTitikApi: titikapiController.statusTitikApiPadam(this.state.titikApiParent.ID)
                })
            }
        );
    }

    getTitikApiDetail(){
        let titikapiData = titikapiController.findTitikApiDetail(this.state.titikApiParent.ID);
        this.setState({
            titikApiDetail: titikapiData
        });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    textLabel={"Penanganan Titik Api"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={COLOR.GREY}
                    iconLeftSource={"keyboard-arrow-left"}
                    iconLeftSize={SIZE.ICON_LARGE+30}
                    iconLeftAction={()=>{this.props.navigation.pop()}}
                />
                <View style={{flex: 1}}>
                    <View style={{alignItems:"center", justifyContent:"center", marginHorizontal: 10}}>
                        <Image
                            style={{
                                width: 125,
                                height: 125
                            }}
                            source={LOGO_APP}
                            resizeMode={"stretch"}
                        />
                        <Text
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_MEDIUM}
                            //text label #DR - WERKS - DATE
                            textLabel={`${this.state.titikApiDetail.length > 0 ? `#${this.state.titikApiDetail[this.state.titikApiDetail.length-1].EMPLOYEE_FULLNAME.slice(0,3)}-${this.state.titikApiDetail[this.state.titikApiDetail.length-1].ID.slice(this.state.titikApiDetail[this.state.titikApiDetail.length-1].ID.length-5, this.state.titikApiDetail[this.state.titikApiDetail.length-1].ID.length-1)}-${this.state.titikApiDetail[this.state.titikApiDetail.length-1].ID.slice(0,this.state.titikApiDetail[this.state.titikApiDetail.length-1].ID.length-5)}` : ""}`}
                        />
                        <Text
                            style={{paddingVertical: 5}}
                            textFontFamily={"BOLD"}
                            textFontAlign={"center"}
                            textLabel={`Di laporkan ${this.state.titikApiDetail.length > 0 ? `${this.state.titikApiDetail[this.state.titikApiDetail.length-1].EMPLOYEE_FULLNAME} - ${moment(this.state.titikApiDetail[this.state.titikApiDetail.length-1].INSERT_TIME,"YYYYMMDDHHmmss").format("DD MMM YYYY, HH:mm")}` : ""}`}
                        />
                        <Text
                            style={{paddingVertical: 5}}
                            textFontFamily={"BOLD"}
                            textFontAlign={"center"}
                            textLabel={`Lokasi : ${this.state.titikApiDetail.length > 0 ? this.state.titikApiDetail[this.state.titikApiDetail.length-1].LOKASI : ""}`}
                        />
                        {
                            !this.state.statusTitikApi &&
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate("TitikApiUpdateForm", {titikApiParent: this.state.titikApiParent})
                                }}
                                style={
                                    {
                                        backgroundColor:COLOR.RED_1,
                                        width: 225,
                                        height: 40,
                                        borderRadius: 10,
                                        paddingHorizontal: 25,
                                        paddingTop: 10,
                                        alignSelf:"center",
                                        alignItems:"center",
                                        marginVertical: 10
                                    }
                                }>
                                <Text
                                    textLabel={"Update Progress"}
                                    style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}/>
                            </TouchableOpacity>
                        }
                    </View>
                    <FlatList
                        style={{paddingHorizontal: 15, paddingTop: 10}}
                        data={this.state.titikApiDetail}
                        extraData={this.state}
                        removeClippedSubviews={true}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return(
                                <TouchableOpacity
                                    onPress={()=>{this.props.navigation.navigate("TitikApiPenangananDetail", {titikApi: item, index: (this.state.titikApiDetail.length-1)-index, statusApi: this.statusChecker(item.LAPOR_PIHAK_BERWAJIB, item.STATUS_TITIK_API)})}}
                                >
                                    {this.renderStatus(item, index)}
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    renderStatus(titikApi, index){
        let statusPadam = titikApi.LAPOR_PIHAK_BERWAJIB === "YES";

        if(index === this.state.titikApiDetail.length-1){
            return(
                <View style={{flexDirection:"row", minHeight: 50}}>
                    <View style={{alignItems:"center"}}>
                        <View
                            style={{
                                width: 15,
                                height: 15,
                                margin: 5,
                                borderRadius: 7.5,
                                backgroundColor:COLOR.RED_1
                            }}
                        />
                    </View>
                    <View style={{paddingTop: 5}}>
                        <Text
                            textColor={COLOR.RED_1}
                            textLabel={"Titik Api Baru"}
                        />
                        <View style={{flexDirection:"row"}}>
                            <Text
                                textFontFamily={"HEADER"}
                                textLabel={`${titikApi.EMPLOYEE_FULLNAME}`}
                            />
                            <Text
                                textLabel={` - ${moment(titikApi.INSERT_TIME, "YYYYMMDDHHmmss").format("DD MM YYYY, HH:mm")}`  }
                            />
                        </View>
                    </View>
                </View>
            )
        }

        return(
            <View style={{flexDirection:"row", minHeight: 50}}>
                <View style={{alignItems:"center"}}>
                    <View
                        style={{
                            width: 15,
                            height: 15,
                            margin: 5,
                            borderRadius: 7.5,
                            borderWidth: 2,
                            borderColor: statusPadam ? COLOR.GREEN_1 : COLOR.RED_1
                        }}
                    />
                    <View style={{width: 1, flex: 1, backgroundColor:"black"}}/>
                </View>
                <View style={{paddingTop: 5}}>
                    <Text
                        textColor={statusPadam ? COLOR.GREEN_1 : COLOR.RED_1}
                        textLabel={`Update ke ${(this.state.titikApiDetail.length-1)-index} : ${this.statusChecker(titikApi.LAPOR_PIHAK_BERWAJIB, titikApi.STATUS_TITIK_API)}`}
                    />
                    <View style={{flexDirection:"row"}}>
                        <Text
                            textFontFamily={"HEADER"}
                            textLabel={`${titikApi.EMPLOYEE_FULLNAME}`}
                        />
                        <Text
                            textLabel={` - ${moment(titikApi.INSERT_TIME, "YYYYMMDDHHmmss").format("DD MM YYYY, HH:mm")}`  }
                        />
                    </View>
                </View>
            </View>
        )
    }

    statusChecker(statusLapor, statusTitikApi){
        if(statusTitikApi === "PADAM"){
            return "Padam"
        }
        else if(statusLapor === "YES" && statusTitikApi === "BELUM PADAM"){
            return "Lapor ke pihak berwajib"
        }
        else if (statusLapor === "NO" && statusTitikApi === "BELUM PADAM"){
            return "Belum padam"
        }
        else {
            return "error"
        }
    }
}
