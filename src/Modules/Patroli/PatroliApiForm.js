import React, {Component} from 'react';
import {Image, NativeModules, TextInput, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Video from 'react-native-video';

import PatroliController from './Controller/PatroliController';
import userController from '../Controller/UserController';

import {ModalContinue} from './Modal/ReportApi_ModalContinue'

import {HeaderIcon, Alert} from '../../UI/Component'
import {Icon, Text} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';

export default class PatroliApiForm extends Component{
    constructor(props){
        super(props);

        this.state={
            continueVisible: false,

            userData: userController.getUserData(),
            sessionID: props.route.params.patroliSession,
            dataJalur:{
                selectedWerks: props.route.params.selectedWerks,
                selectedJalur: props.route.params.selectedJalur
            },

            inputForm:{
              tanggalLaporan: null,
              luasAreaKebakaran: null,
              lokasi: null,
              detail: null
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

            location:props.route.params.location,

            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            }

        }
    }

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
        let date = moment(`${this.state.calendar.date}, ${this.state.calendar.time}:00`, "DD MMM YYYY, HH:mm:ss").format("YYYYMMDDHHmmss")
        let titikApi = {
            ID: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`,
            ID_SESSION: this.state.sessionID,
            BA_CODE: this.state.dataJalur.selectedWerks,
            LONGITUDE: this.state.location.longitude,
            LATITUDE: this.state.location.latitude,
            DATE: date,
            INSERT_TIME: dateNow,
            LUAS_AREA: this.state.inputForm.luasAreaKebakaran,
            LOKASI: this.state.inputForm.lokasi,
            KETERANGAN: this.state.inputForm.detail,
            LAPOR_PIHAK_BERWAJIB: "NO",

            UNIQUE_TAG: `API${moment().format("YYYYMMDDHHmmss")}`,
            SYNC_STATUS: false,
            EMPLOYEE_FULLNAME: this.state.userData.EMPLOYEE_FULLNAME,
            INSERT_USER: this.state.userData.EMPLOYEE_EMAIL
        };

        let cameraData = {};
        if(this.state.camera.type === "camera"){
            cameraData = {
                ID: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`,
                RELATION_ID: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`,
                IMAGE_NAME: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}.jpg`,
                INSERT_TIME: dateNow,

                IMAGE_TYPE: "TITIK-API",
            };
        }
        else {
            cameraData={
                ID: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`,
                RELATION_ID: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}`,
                VIDEO_NAME: `${dateNow}${this.state.dataJalur.selectedWerks}${this.state.dataJalur.selectedJalur}.mp4`,
                INSERT_TIME: dateNow,

                VIDEO_TYPE: "TITIK-API",
            }
        }

        PatroliController.saveTitikApi(titikApi);
        await PatroliController.saveTitikApiCamera(this.state.camera.type, cameraData, this.state.camera.uri);
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderIcon
                    textLabel={"Informasi Titik Api"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={COLOR.GREY}
                    iconLeftSource={"keyboard-arrow-left"}
                    iconLeftSize={SIZE.ICON_LARGE+30}
                    iconLeftAction={()=>{this.props.navigation.pop()}}
                />
                <View
                    style={{
                        width: "100%",
                        height:"33.3%"
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
                <View style={{flex: 1}}>
                    <View style={{flex: 1, marginHorizontal: 25, justifyContent:"space-between", marginVertical: 15}}>
                        <View>
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
                                                ...this.state.inputForm
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
                        <View>
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
                        </View>
                        <View>
                            <Text
                                textLabel={"Lokasi *"}
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
                                    style={{paddingHorizontal: 0, margin: 0, paddingVertical: 5}}
                                    value={this.state.inputForm.lokasi}
                                    onChangeText={(value) => {
                                        this.setState({
                                            inputForm: {
                                                ...this.state.inputForm,
                                                lokasi: value
                                            }
                                        })
                                    }}
                                    placeholder={"Diisi lokasi terdekat, misal blok A06"}
                                />
                            </View>
                        </View>
                        <View>
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
                                            inputForm: {
                                                ...this.state.inputForm,
                                                detail: value
                                            }
                                        })
                                    }}
                                    placeholder={"Tulis keterangan disini..."}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                if(
                                    this.state.calendar.date &&
                                    this.state.inputForm.luasAreaKebakaran &&
                                    this.state.inputForm.lokasi &&
                                    this.state.inputForm.detail &&
                                    this.state.camera.uri
                                ){
                                    this.saveTitikApi();
                                    this.setState({
                                        continueVisible: true
                                    })
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
                </View>
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
                <ModalContinue
                    visible={this.state.continueVisible}
                    actionContinue={()=>{
                        this.setState({
                            continueVisible: false
                        },()=>{
                            this.props.navigation.pop();
                        })
                    }}
                    actionSelesai={()=>{
                        this.setState({
                            continueVisible: false
                        },()=>{
                            NativeModules.LocationService.stopService();
                            this.props.navigation.popToTop();
                        })
                    }}
                />
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
