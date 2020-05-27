import React, {Component} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

import patroliController from '../Patroli/Controller/PatroliController';
import syncController from '../Controller/SyncController';
import userController from '../Controller/UserController';
import BAController from '../Controller/BAController';

import RealmServices from '../../Data/Realm/RealmServices';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

import {Header, Alert} from "../../UI/Component";
import {ModalLoading, ModalDownloadBA} from "../../UI/Modal";
import {Icon, Text} from "../../UI/Widgets";
import {LOGO_APP} from "../../Asset";

export default class PatroliHistory extends Component{
    constructor(){
        super();
        this.state={
            userData: userController.getUserData(),
            activeBA: [],
            sessionList: [],
            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            },
            modalLoading: false,
            downloadModalBA: false
        };
    }

    componentDidMount(): void {
        this.didFocus = this.props.navigation.addListener(
            'focus',
            ()=>{
                this.getAllSession();
                this.getActiveBA();
            }
        );
    }

    componentWillUnmount() {
        this.didFocus.remove();
    }

    getActiveBA(){
        this.setState({
            activeBA: BAController.getActiveBACodeOnly()
        })
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    textLabel={"Sinkronisasi"}
                    textColor={COLOR.BLACK}
                    textSize={SIZE.TEXT_MEDIUM}
                    borderColor={COLOR.GREY}
                />
                <View style={{
                    flex: 1,
                    padding: 20
                }}>
                    <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                        <View>
                            <Text
                                style={{padding: 2.5}}
                                textLabel={"Hai,"}
                                textFontFamily={"HEADER"}
                            />
                            <View style={{flexDirection:"row"}}>
                                <Text
                                    style={{paddingLeft: 2.5, paddingHorizontal: 2.5}}
                                    textLabel={this.state.userData.EMPLOYEE_FULLNAME}
                                />
                                {
                                    !userController.isUserAuthorized() &&
                                    <Text
                                        style={{paddingLeft: 2.5, paddingHorizontal: 2.5}}
                                        textLabel={`- ${this.state.activeBA.join(",").length > 14 ? this.state.activeBA.join(",").slice(0,14)+"..." : this.state.activeBA.join(",").slice(0,14)}`}
                                    />
                                }
                            </View>
                        </View>
                        {
                            !userController.isUserAuthorized() &&
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        downloadModalBA: true
                                    })
                                }}
                                style={{
                                    alignSelf:"center",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    padding: 5,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }}>
                                <Text
                                    textSize={SIZE.TEXT_SMALL}
                                    textLabel={"Ubah Lokasi"}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    {this.renderSessionList()}
                    <TouchableOpacity
                        onPress={()=>{this.syncStart()}}
                        style={{
                            backgroundColor:COLOR.RED_1,
                            alignItems:"center",
                            justifyContent:"center",
                            marginTop: 20,
                            paddingVertical: 10,
                            borderRadius: 10
                        }}>
                        <Text
                            textLabel={"Sinkronisasi"}
                            textFontFamily={"BOLD"}
                            textColor={COLOR.WHITE}
                        />
                    </TouchableOpacity>
                </View>
                <Alert
                    action={()=>{this.setState({
                        alertModal: {...this.state.alertModal, visible: false}
                    })}}
                    visible={this.state.alertModal.visible}
                    alertTitle={this.state.alertModal.title}
                    alertDescription={this.state.alertModal.description}
                />
                <ModalLoading
                    show={this.state.modalLoading}
                />
                <ModalDownloadBA
                    visible={this.state.downloadModalBA}
                    modalAction={(listBA)=>{
                        this.setState({
                            modalLoading: true,
                            downloadModalBA: !this.state.downloadModalBA
                        }, async ()=>{
                            if(listBA && listBA.length > 0){
                                let statusDownload = await syncController.downloadJalurPatroli(listBA);
                                if(!statusDownload) {
                                    alert("download jalur gagal")
                                }
                                this.getActiveBA();
                                this.setState({
                                    modalLoading: false
                                })
                            }
                            else {
                                this.setState({
                                    modalLoading: false
                                })
                            }
                        });
                    }}
                />
            </View>
        )
    }

    async syncStart(){
        this.setState({
            modalLoading: true
        })
        let track = await syncController.uploadTrack();
        let titikApi = await syncController.uploadTitikApi();
        let video = await syncController.uploadVideo();
        let image = await syncController.uploadImage();
        console.log("track", track);
        console.log("titikApi",titikApi);
        console.log("video",video);
        console.log("image",image);
        if(track && titikApi && video && image){
            let downloadTitikApi = await syncController.downloadTitikApi();
            this.setState({
                modalLoading: false,
                alertModal: {
                    ...this.state.alertModal,
                    visible: true,
                    title: "Sync Berhasil",
                    description: "Sync berhasil!"
                }
            })
        }
        else {
            this.setState({
                modalLoading: false,
                alertModal: {
                    ...this.state.alertModal,
                    visible: true,
                    title: "Sync Gagal",
                    description: "Sync track bermasalah!"
                }
            })
        }
        this.getAllSession();
    }

    renderSessionList(){
        if(this.state.sessionList.length > 0){
            return (
                <FlatList
                    style={{marginVertical: 5}}
                    data={this.state.sessionList}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                        let titikApiCount = patroliController.getTitikApiCount(item.ID);
                        return (
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate("PatroliHistoryDetail", {patroliData: {ID: item.ID, JALUR: item.JALUR, WERKS: item.WERKS, duration: item.DURASI, jarak: item.JARAK, checkpoint: item.CHECKPOINT, titikApi: titikApiCount}})
                                }}
                                style={{flexDirection:"row"}}
                            >
                                <View
                                    style={{
                                        width: 75,
                                        height: 75,
                                        borderRadius: 37.5,
                                        borderWidth: 1,
                                        alignItems:'center',
                                        justifyContent:"center",
                                        margin: 10
                                    }}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25
                                        }}
                                        source={LOGO_APP}
                                        resizeMode={"stretch"}
                                    />
                                    <Text
                                        textLabel={"Ada api"}
                                    />
                                </View>
                                <View style={{flex: 1, marginLeft: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor:COLOR.RED, alignSelf:"center"}}>
                                    <View style={{flexDirection:"row"}}>
                                        <Text
                                            textLabel={"PATROLI"}
                                            textSize={SIZE.TEXT_MEDIUM}
                                            textFontFamily={"BOLD"}
                                        />
                                        <Text
                                            style={{paddingLeft: 5, alignSelf:"center"}}
                                            textLabel={item.TRACK_SYNC ? "Terkirim" : "Belum dikirim"}
                                            textSize={SIZE.TEXT_SMALL}
                                        />
                                    </View>
                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                        <Icon
                                            iconName={"today"}
                                            iconSize={SIZE.ICON_MEDIUM}
                                        />
                                        <Text
                                            style={{marginLeft: 5}}
                                            textLabel={moment(item.INSERT_TIME, "YYYYMMDDHHmmss").format("DD  MMM  YYYY, HH:mm")}
                                        />
                                    </View>
                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                        <Icon
                                            iconName={"location-on"}
                                            iconSize={SIZE.ICON_MEDIUM}
                                        />
                                        <Text
                                            style={{marginLeft: 5}}
                                            textLabel={item.CHECKPOINT}
                                        />
                                    </View>
                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                        <Image
                                            style={{
                                                width: 15,
                                                height: 15
                                            }}
                                            source={require('../../Asset/Icon/ic_fire_grey.png')}
                                            resizeMode={"stretch"}
                                        />
                                        <Text
                                            style={{marginLeft: 5}}
                                            textLabel={titikApiCount}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            )
        }
        else {
            return (
                <View style={{
                    flex: 1,
                    alignItems:"center",
                    justifyContent:"center"
                }}>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        textLabel={"Data Kosong"}
                    />
                </View>
            )
        }
    }

    getAllSession(){
        let sessionData = RealmServices.getAllData("TABLE_SESSION").sorted("INSERT_TIME", true);
        this.setState({
            sessionList: sessionData
        });
    }

    // async sendFiles(sessionModel){
    //     let statusKML = await this.createKMLFile(sessionModel);
    //     let statusCSV = await this.createCSVFile(sessionModel);
    //
    //     if(statusCSV && statusKML){
    //         let zipPath = directoryPatroli + `/${sessionModel.ID}`;
    //         let zipDestination = directoryPatroli + `/${sessionModel.NAME}${sessionModel.ID.replace("P","")}.zip`;
    //         await zip(zipPath.toString(), zipDestination.toString())
    //             .then((path) => {
    //                 this.sendEmail(path, sessionModel);
    //             })
    //             .catch((error) => {
    //                 alert(error)
    //             });
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    //
    // async createKMLFile(sessionModel){
    //     let successStatus = false;
    //
    //     let fileName = sessionModel.NAME+"_"+sessionModel.ID.replace("P","")+".kml";
    //     let filePath = directoryPatroli + `/${sessionModel.ID}/` + fileName;
    //     let fileData = await generateKMLData(sessionModel.ID, sessionModel.NAME);
    //     await generateKMLFile(filePath.toString(), fileData.toString())
    //         .then((response)=>{
    //             if(response){
    //                 // this.props.navigation.navigate("Patroli")
    //                 // this.handleEmail(filePath, fileName, item);
    //                 successStatus = true;
    //             }
    //         });
    //
    //     return successStatus;
    // }
    //
    // async createCSVFile(sessionModel){
    //     let successStatus = true;
    //
    //     let fileName = sessionModel.NAME+"_"+sessionModel.ID.replace("P","")+".csv";
    //     let filePath = directoryPatroli + `/${sessionModel.ID}/` + fileName;
    //     let fileData = await patroliToCsvFormat(sessionModel.ID);
    //     generateCSVFile(filePath.toString(), fileData.toString())
    //         .then((response)=>{
    //             if(response){
    //                 // this.props.navigation.navigate("Patroli")
    //                 // this.handleEmail(filePath, fileName, item);
    //                 successStatus = true;
    //             }
    //         });
    //
    //     return successStatus;
    // }
    //
    // sendEmail(filePath, sessionModel){
    //     let formatDate = moment(sessionModel.INSERT_TIME, "YYYYMMDDHHmmss").format("DD MMM YY, HH:mm");
    //     try {
    //         Mailer.mail({
    //             subject: `Patroli Api - ${sessionModel.NAME} - ${formatDate}`,
    //             recipients: ['hotspot@tap-agri.com'],
    //             ccRecipients: [''],
    //             bccRecipients: [''],
    //             body: `Dengan ini saya ${sessionModel.NAME} menyatakan telah melakukan patroli api\npada ${formatDate}.\nTerlampir hasil patroli saya.`,
    //             isHTML: false,
    //             attachment: {
    //                 path: filePath,  // The absolute path of the file from which to read data.
    //                 type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
    //                 name: sessionModel.ID.replace("P",""),   // Optional: Custom filename for attachment
    //             }
    //         }, (error, event) => {
    //             alert("Err email:",error);
    //             return false
    //         });
    //         return true
    //     }
    //     catch (e) {
    //         return false
    //     }
    // };
}
