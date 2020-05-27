import React, {Component} from 'react';
import {Image, FlatList, TouchableOpacity, View, ScrollView, Dimensions} from 'react-native';
import moment from 'moment';

import titikapiController from './Controller/TitikApiController';
import patroliController from '../Patroli/Controller/PatroliController';

import {HeaderIcon} from '../../UI/Component'
import {Icon, Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";
import Video from "react-native-video";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class TitikApiPenangananDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            titikApiDetail: props.route.params.titikApi,
            index: props.route.params.index,
            statusApi: props.route.params.statusApi,
            cameraData: {
                data: null,
                type: null
            }
        }
    }

    async componentDidMount(): void {
        this.getCameraData();
    }

    getCameraData(){
        let idJalur = this.state.titikApiDetail.ID[this.state.titikApiDetail.ID.length-1];
        let cameraData = titikapiController.findCameraData(`${this.state.titikApiDetail.INSERT_TIME}${this.state.titikApiDetail.BA_CODE}${idJalur}`);
        if(cameraData){
            this.setState({
                cameraData: cameraData
            })
        }
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
                    <View style={{alignItems:"center", justifyContent:"center", paddingVertical: 20}}>
                        <Text
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_MEDIUM}
                            textLabel={`#${this.state.titikApiDetail.EMPLOYEE_FULLNAME.slice(0,3)}-${this.state.titikApiDetail.ID.slice(this.state.titikApiDetail.ID.length-5, this.state.titikApiDetail.ID.length-1)}-${this.state.titikApiDetail.ID.slice(0,this.state.titikApiDetail.ID.length-5)}`}
                        />
                        <Text
                            style={{paddingVertical: 5, paddingHorizontal: 10}}
                            textFontAlign={"center"}
                            textFontFamily={"BOLD"}
                            textLabel={`Di laporkan ${this.state.titikApiDetail.EMPLOYEE_FULLNAME} - ${moment(this.state.titikApiDetail.INSERT_TIME,"YYYYMMDDHHmmss").format("DD MMM YYYY, HH:mm")}`}
                        />
                    </View>
                    <View
                        style={{
                            width: screenWidth,
                            height: screenHeight*0.33
                        }}>
                        {
                            this.state.cameraData.data &&
                            this.state.cameraData.type === "video" &&
                            <Video
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                repeat={true}
                                resizeMode={"cover"}
                                source={{uri:`file://${this.state.cameraData.data.VIDEO_LOCAL_PATH}`}}       // Store reference
                                onBuffer={()=>{}}                // Callback when remote video is buffering
                                onError={(err)=>{console.log(err)}}               // Callback when video cannot be loaded
                                style={{
                                    flex: 1
                                }}
                            />
                        }
                        {
                            this.state.cameraData.data &&
                            this.state.cameraData.type === "photo" &&
                            <Image
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                source={{uri: `file://${this.state.cameraData.data.IMAGE_LOCAL_PATH}`}}
                                resizeMode={"stretch"}
                            />
                        }
                    </View>
                    <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                        <Text
                            style={{paddingTop: 5}}
                            textColor={COLOR.RED_1}
                            textSize={SIZE.TEXT_MEDIUM}
                            textLabel={`Update ke ${this.state.index} : ${this.state.statusApi}`}
                        />
                        <Text
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_SMALL}
                            textLabel={`${this.state.titikApiDetail.EMPLOYEE_FULLNAME} - ${moment(this.state.titikApiDetail.DATE,"YYYYMMDDHHmmss").format("DD MMM YYYY, HH:mm")}`}
                        />
                        <Text
                            style={{paddingBottom: 10}}
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_SMALL}
                            textLabel={`Luas kebakaran : ${this.state.titikApiDetail.LUAS_AREA} HA`}
                        />
                        <Text
                            textSize={SIZE.TEXT_SMALL}
                            textLabel={this.state.titikApiDetail.KETERANGAN}
                        />
                    </View>

                </View>
            </View>
        )
    }
}
