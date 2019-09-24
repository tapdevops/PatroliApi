import React, {Component} from 'react';
import {Text, View, Image, FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Mailer from 'react-native-mail';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

import {generateKMLFile, generateKMLData} from '../../Data/Function/FileGenerator/KMLFile';
import {generateCSVFile, patroliToCsvFormat} from '../../Data/Function/FileGenerator/CSVFile';
import {directoryPatroli} from '../../Data/Constant/FilePath';

import RealmServices from '../../Data/Realm/RealmServices';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";

import {Header} from "../../UI/Component";

export default class KirimData extends Component{
    constructor(){
        super();
        this.state={
            sessionList: []
        };
    }

    componentDidMount(): void {
        this.didFocus = this.props.navigation.addListener(
            'didFocus',
            ()=>{
                this.getAllSession()
            }
        );
    }

    componentWillUnmount() {
        this.didFocus.remove();
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    backgroundColor={"red"}
                    textLabel={"Kirim Data"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                />
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        margin: 25,
                        alignSelf:"center"
                    }}>Datamu</Text>
                    {this.renderSessionList()}
                </View>
            </View>
        )
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
                        return (
                            <View style={{
                                marginHorizontal: "10%"
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                    <Text>{item.NAME+"_"+item.INSERT_TIME}</Text>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            this.sendFiles(item)
                                                .then((response)=>{
                                                })
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25
                                            }}
                                            source={require('../../Asset/Icon/ic_email.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
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

    async sendFiles(sessionModel){
        let statusKML = await this.createKMLFile(sessionModel);
        let statusCSV = await this.createCSVFile(sessionModel);

        if(statusCSV && statusKML){
            let zipPath = directoryPatroli + `/${sessionModel.ID}`;
            let zipDestination = directoryPatroli + `/${sessionModel.NAME}${sessionModel.ID.replace("P","")}.zip`;
            await zip(zipPath.toString(), zipDestination.toString())
                .then((path) => {
                    this.sendEmail(path, sessionModel);
                })
                .catch((error) => {
                    alert(error)
                });
            return true;
        }
        else {

            return false;
        }
    }

    async createKMLFile(sessionModel){
        let successStatus = false;

        let fileName = sessionModel.NAME+"_"+sessionModel.ID.replace("P","")+".kml";
        let filePath = directoryPatroli + `/${sessionModel.ID}/` + fileName;
        let fileData = await generateKMLData(sessionModel.ID, sessionModel.NAME);
        await generateKMLFile(filePath.toString(), fileData.toString())
            .then((response)=>{
                if(response){
                    // this.props.navigation.navigate("Patroli")
                    // this.handleEmail(filePath, fileName, item);
                    successStatus = true;
                }
            });

        return successStatus;
    }

    async createCSVFile(sessionModel){
        let successStatus = true;

        let fileName = sessionModel.NAME+"_"+sessionModel.ID.replace("P","")+".csv";
        let filePath = directoryPatroli + `/${sessionModel.ID}/` + fileName;
        let fileData = await patroliToCsvFormat(sessionModel.ID);
        generateCSVFile(filePath.toString(), fileData.toString())
            .then((response)=>{
                if(response){
                    // this.props.navigation.navigate("Patroli")
                    // this.handleEmail(filePath, fileName, item);
                    successStatus = true;
                }
            });

        return successStatus;
    }

    sendEmail(filePath, sessionModel){
        let formatDate = moment(sessionModel.INSERT_TIME, "YYYYMMDDHHmmss").format("DD MMM YY, HH:mm");
        try {
            Mailer.mail({
                subject: `Patroli Api - ${sessionModel.NAME} - ${formatDate}`,
                recipients: ['hotspot@tap-agri.com'],
                ccRecipients: [''],
                bccRecipients: [''],
                body: `Dengan ini saya ${sessionModel.NAME} menyatakan telah melakukan patroli api\npada ${formatDate}.\nTerlampir hasil patroli saya.`,
                isHTML: false,
                attachment: {
                    path: filePath,  // The absolute path of the file from which to read data.
                    type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                    name: sessionModel.ID.replace("P",""),   // Optional: Custom filename for attachment
                }
            }, (error, event) => {
                alert("Err email:",error);
                return false
            });
            return true
        }
        catch (e) {
            return false
        }
    };
}
