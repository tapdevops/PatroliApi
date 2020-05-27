import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Video from "react-native-video";

import {Alert, HeaderIcon} from '../../UI/Component'
import {Icon, RadioBox, Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";
import moment from "moment";
import patroliController from "../Patroli/Controller/PatroliController";
import userController from "../Controller/UserController";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class TitikApiUpdateForm extends Component{
    constructor(props){
        super(props);

        this.state={
            userData: userController.getUserData(),
            continueVisible: false,
            titikApiParent: props.route.params.titikApiParent,

            inputForm:{
                tanggalLaporan: null,
                luasAreaKebakaran: null,
                luasAreaParent: false,
                detail: null,
                lapor: false,
                statusApi: "BELUM PADAM"
            },

            camera: {
                type: null,
                uri: null
            },

            calendar: {
                date: moment().format("DD MMM YYYY"),
                time: moment().format("HH:mm"),
                show: false,
                mode: "date"
            },
            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            }
        }
    }

    async componentDidMount(): void {}

    getCameraResult(photoURI, type){
        this.setState({
            camera: {
                ...this.state.camera,
                type: type,
                keyuri: `${photoURI}?${new Date()}`,
                uri: photoURI
            }
        }, ()=>{
            this.props.navigation.pop()
        });
    }

    async saveTitikApi(){
        let dateNow = moment().format("YYYYMMDDHHmmss");
        let date = moment(`${this.state.calendar.date}, ${this.state.calendar.time}:00`, "DD MMM YYYY, HH:mm:ss").format("YYYYMMDDHHmmss");
        let titikApi = {
            ID: this.state.titikApiParent.ID,
            ID_SESSION: this.state.titikApiParent.ID_SESSION,
            BA_CODE: this.state.titikApiParent.BA_CODE,
            LONGITUDE: this.state.titikApiParent.LONGITUDE,
            LATITUDE: this.state.titikApiParent.LATITUDE,
            DATE: date,
            INSERT_TIME: dateNow,
            LUAS_AREA: this.state.inputForm.luasAreaParent ? this.state.titikApiParent.LUAS_AREA : this.state.inputForm.luasAreaKebakaran ,
            LOKASI: this.state.titikApiParent.LOKASI,
            KETERANGAN: this.state.inputForm.detail,
            STATUS_TITIK_API: this.state.inputForm.statusApi,
            LAPOR_PIHAK_BERWAJIB: this.state.inputForm.lapor ? "YES" : "NO",

            UNIQUE_TAG: `API${moment().format("YYYYMMDDHHmmss")}`,
            SYNC_STATUS: false,
            EMPLOYEE_FULLNAME: this.state.userData.EMPLOYEE_FULLNAME,
            INSERT_USER: this.state.userData.EMPLOYEE_EMAIL
        };

        let cameraData = {};
        let idJalur = titikApi.ID[titikApi.ID.length-1];
        if(this.state.camera.type === "camera"){
            cameraData = {
                ID: `${dateNow}${titikApi.BA_CODE}${idJalur}`,
                RELATION_ID: this.state.titikApiParent.ID,
                IMAGE_NAME: `${dateNow}${titikApi.BA_CODE}${idJalur}.jpg`,
                INSERT_TIME: dateNow,

                IMAGE_TYPE: "TITIK-API",
            };
        }
        else {
            cameraData={
                ID: `${dateNow}${titikApi.BA_CODE}${idJalur}`,
                RELATION_ID: this.state.titikApiParent.ID,
                VIDEO_NAME: `${dateNow}${titikApi.BA_CODE}${idJalur}.mp4`,
                INSERT_TIME: dateNow,

                VIDEO_TYPE: "TITIK-API",
            }
        }

        patroliController.saveTitikApi(titikApi);
        await patroliController.saveTitikApiCamera(this.state.camera.type, cameraData, this.state.camera.uri);
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
                <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor:COLOR.WHITE}}>
                    <View
                        style={{
                            width: screenWidth,
                            height: screenHeight*0.33
                        }}>
                        {
                            this.state.camera.type === "video"
                            &&
                            this.state.camera.uri
                            &&
                            <Video
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                repeat={true}
                                resizeMode={"cover"}
                                source={{uri:this.state.camera.uri}}       // Store reference
                                onBuffer={()=>{}}                // Callback when remote video is buffering
                                onError={(err)=>{console.log(err)}}               // Callback when video cannot be loaded
                                style={{
                                    flex: 1
                                }}
                            />
                        }
                        {
                            this.state.camera.type === "camera"
                            &&
                            this.state.camera.uri
                            &&
                            <Image
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                source={this.state.camera.keyuri ? {uri: `file://${this.state.camera.keyuri}`} : null}
                                resizeMode={"stretch"}
                            />
                        }
                        <View style={{
                            position:"absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent:"flex-end"
                        }}>
                            {
                                !this.state.camera.uri
                                &&
                                <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
                                    <Text
                                        textFontAlign={"center"}
                                        textLabel={"Klik tombol di bawah\nuntuk ambil foto / video"}
                                    />
                                </View>
                            }
                            <TouchableOpacity
                                style={{
                                    margin: 10,
                                    padding: 10,
                                    backgroundColor:COLOR.RED_1,
                                    borderRadius: 25,
                                    alignSelf:"center"
                                }}
                                onPress={()=>{
                                    this.props.navigation.navigate("Camera", {sessionID: this.state.sessionID, cameraAction: (photoURI, type)=>{this.getCameraResult(photoURI, type)}});
                                }}
                            >
                                <Icon
                                    iconSize={20}
                                    iconColor={COLOR.WHITE}
                                    iconName={"photo-camera"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Text
                            style={{paddingTop: 10}}
                            textFontFamily={"HEADER"}
                            textSize={SIZE.TEXT_MEDIUM}
                            textLabel={`#${this.state.titikApiParent.EMPLOYEE_FULLNAME.slice(0, 3)}-${this.state.titikApiParent.ID.slice(this.state.titikApiParent.ID.length - 5, this.state.titikApiParent.ID.length - 1)}-${this.state.titikApiParent.ID.slice(0, this.state.titikApiParent.ID.length - 5)}`}
                        />
                        <Text
                            style={{paddingVertical: 5}}
                            textFontFamily={"BOLD"}
                            textFontAlign={"center"}
                            textLabel={`Di laporkan ${this.state.titikApiParent.EMPLOYEE_FULLNAME} - ${moment().format("DD MMM YYYY, HH:mm")}`}
                        />
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        inputForm:{
                                            ...this.state.inputForm,
                                            statusApi: "BELUM PADAM"
                                        }
                                    })
                                }}
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 37.5,
                                    borderWidth: 1,
                                    borderColor: this.state.inputForm.statusApi === "PADAM" ? COLOR.RED_1 : COLOR.WHITE,
                                    backgroundColor: this.state.inputForm.statusApi === "PADAM" ? COLOR.WHITE : COLOR.RED_1,
                                    alignItems:'center',
                                    justifyContent:"center",
                                    marginHorizontal: 10,
                                    marginTop: 10
                                }}>
                                <Text
                                    textColor={this.state.inputForm.statusApi === "PADAM" ? COLOR.RED_1 : COLOR.WHITE}
                                    textFontAlign={"center"}
                                    textLabel={"Belum\nPadam"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        inputForm:{
                                            ...this.state.inputForm,
                                            statusApi: "PADAM"
                                        }
                                    })
                                }}
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 37.5,
                                    borderWidth: 1,
                                    borderColor: this.state.inputForm.statusApi === "PADAM" ? COLOR.WHITE : COLOR.RED_1,
                                    backgroundColor: this.state.inputForm.statusApi === "PADAM" ? COLOR.RED_1 : COLOR.WHITE,
                                    alignItems:'center',
                                    justifyContent:"center",
                                    marginHorizontal: 10,
                                    marginTop: 10
                                }}>
                                <Text
                                    textColor={this.state.inputForm.statusApi === "PADAM" ? COLOR.WHITE : COLOR.RED_1}
                                    textLabel={"Padam"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 25, marginVertical: 15}}>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Tanggal Laporan *"}
                            />
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        calendar:{
                                            ...this.state.calendar,
                                            mode: "date",
                                            show: true
                                        }
                                    })
                                }}
                                style={{
                                    flexDirection:"row",
                                    paddingHorizontal: 10,
                                    marginTop: 5,
                                    borderBottomWidth: 1,
                                    justifyContent:"space-between",
                                    alignItems:"center"}}
                            >
                                <TextInput
                                    style={{padding: 0, margin: 0}}
                                    value={`${this.state.calendar.date}, ${this.state.calendar.time}`}
                                    onChangeText={(value) => {
                                        this.setState({
                                            inputForm: {
                                                ...this.state.inputForm,
                                                tanggalLaporan: value
                                            }
                                        })
                                    }}
                                    placeholder={"Tanggal"}
                                />
                                <Icon
                                    iconName={"date-range"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Luas area kebakaran (dalam HA)"}
                            />
                            <View style={{
                                flexDirection:"row",
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderBottomWidth: 1,
                                justifyContent:"space-between",
                                alignItems:"center"
                            }}>
                                <TextInput
                                    style={{padding: 0, margin: 0}}
                                    keyboardType={"numeric"}
                                    maxLength={3}
                                    value={this.state.inputForm.luasAreaKebakaran}
                                    editable={!this.state.inputForm.luasAreaParent}
                                    onChangeText={(value) => {
                                        this.setState({
                                            inputForm: {
                                                ...this.state.inputForm,
                                                luasAreaKebakaran: value
                                            }
                                        })
                                    }}
                                    placeholder={"Diisi estimasi luas kebakaran (dalam HA)"}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        inputForm:{
                                            ...this.state.inputForm,
                                            luasAreaParent: !this.state.inputForm.luasAreaParent,
                                            luasAreaKebakaran : this.state.inputForm.luasAreaParent ? null : this.state.titikApiParent.LUAS_AREA
                                        }
                                    })
                                }}
                                style={{flexDirection:"row", alignItems:"center", paddingTop: 5}}>
                                <RadioBox
                                    toggleStatus={this.state.inputForm.luasAreaParent}
                                />
                                <Text
                                    style={{paddingLeft: 5}}
                                    textSize={SIZE.TEXT_SMALL}
                                    textLabel={"Luas area kebakaran masih sama dengan sebelumnya"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingBottom: 10}}>
                            <Text
                                textLabel={"Keterangan Tambahan"}
                            />
                            <View style={{
                                flexDirection:"row",
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderBottomWidth: 1
                            }}>
                                <TextInput
                                    style={{
                                        padding: 0,
                                        margin: 0
                                    }}
                                    multiline={true}
                                    value={this.state.inputForm.detail}
                                    onChangeText={(value) => {
                                        this.setState({
                                            inputForm:{
                                                ...this.state.inputForm,
                                                detail: value
                                            }
                                        })
                                    }}
                                    placeholder={"Tulis keterangan disini..."}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        inputForm:{
                                            ...this.state.inputForm,
                                            lapor: !this.state.inputForm.lapor
                                        }
                                    })
                                }}
                                style={{flexDirection:"row", alignItems:"center", paddingTop: 5}}>
                                <RadioBox
                                    toggleStatus={this.state.inputForm.lapor}
                                />
                                <Text
                                    style={{paddingLeft: 5}}
                                    textSize={SIZE.TEXT_SMALL}
                                    textLabel={"Sudah dilaporkan ke pihak berwajib"}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                if(
                                    this.state.calendar.date &&
                                    this.state.inputForm.luasAreaKebakaran &&
                                    this.state.inputForm.detail &&
                                    this.state.camera.uri
                                ){
                                    this.saveTitikApi();
                                    this.props.navigation.pop();
                                }
                                else {
                                    this.setState({
                                        alertModal: {
                                            ...this.state.alertModal,
                                            visible: true,
                                            title: "Data belum lengkap",
                                            description: "Lengkapi semua data terlebih dahulu!"
                                        }
                                    })
                                }
                            }}
                            style={{
                                width: 225,
                                height: 40,
                                borderRadius: 10,
                                paddingHorizontal: 25,
                                paddingVertical: 10,
                                alignSelf:"center",
                                alignItems:"center",
                                backgroundColor:COLOR.RED_1,
                            }}>
                            <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {
                    this.state.calendar.show
                    &&
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={this.state.calendar.mode}
                        is24Hour={true}
                        display="default"
                        minimumDate={new Date(2020, 0, 1)}
                        onChange={(event, selectedDate)=>{
                            if(this.state.calendar.mode === "date"){
                                let todayDate = moment().format("DD MMM YYYY");
                                let tempSelectedDate = moment(selectedDate).format("DD MMM YYYY");
                                if(moment(tempSelectedDate).isSameOrBefore(todayDate)){
                                    this.setState({
                                        calendar:{
                                            ...this.state.calendar,
                                            show: true,
                                            mode: "time",
                                            date: tempSelectedDate
                                        }
                                    })
                                }
                                else {
                                    this.setState({
                                        alertModal: {
                                            ...this.state.alertModal,
                                            visible: true,
                                            title: "Tanggal invalid",
                                            description: "Tanggal tidak boleh melebihi hari ini!"
                                        },
                                        calendar:{
                                            ...this.state.calendar,
                                            show: false
                                        }
                                    })
                                }
                            }
                            else {
                                let todayDate = moment().format("HHmm");
                                let tempSelectedDate = moment(selectedDate).format("HHmm");
                                if(parseFloat(tempSelectedDate) <= parseFloat(todayDate)){
                                    this.setState({
                                        calendar:{
                                            ...this.state.calendar,
                                            show: false,
                                            mode: "date",
                                            time: moment(selectedDate).format("HH:mm")
                                        }
                                    })
                                }
                                else {
                                    this.setState({
                                        alertModal: {
                                            ...this.state.alertModal,
                                            visible: true,
                                            title: "Tanggal invalid",
                                            description: "Tanggal tidak boleh melebihi hari ini!"
                                        },
                                        calendar:{
                                            ...this.state.calendar,
                                            show: false
                                        }
                                    })
                                }
                            }
                        }}
                    />
                }
                <Alert
                    action={()=>{this.setState({
                        alertModal: {...this.state.alertModal, visible: false}
                    })}}
                    visible={this.state.alertModal.visible}
                    alertTitle={this.state.alertModal.title}
                    alertDescription={this.state.alertModal.description}
                    alertIcon={require('../../Asset/Alert/login_error.png')}
                />
            </View>
        )
    }

}
