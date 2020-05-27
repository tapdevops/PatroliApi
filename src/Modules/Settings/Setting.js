import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {zip} from 'react-native-zip-archive';
import Mailer from 'react-native-mail';

import RealmServices from '../../Data/Realm/RealmServices';
import {copyFile} from '../../Data/Function/FetchBlob';
import {pathDatabase, pathZip} from "../../Data/Constant/FilePath";

import {Header} from '../../UI/Component'
import {Icon} from '../../UI/Widgets'

import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';

export default class Setting extends Component{
    constructor(){
        super();

        this.state={

        }
    }

    componentDidMount(): void {
    }

    render(){
        return(
            <View
                style={{
                    flex: 1,
                }}>
                <Header
                    backgroundColor={"red"}
                    textLabel={"Settings"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                />
                <TouchableOpacity
                    onPress={()=>{this.exportDatabase()}}
                    style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <View style={{flexDirection: "row", alignItems:'center'}}>
                        <Icon
                            style={{padding: 15}}
                            iconSize={25}
                            iconName={"cloud-upload"}
                        />
                        <Text>
                            Export Database
                        </Text>
                    </View>
                    <Icon
                        style={{padding: 15}}
                        iconSize={25}
                        iconName={"keyboard-arrow-right"}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    async exportDatabase() {
        //create zip file
        await copyFile(RealmServices.getPath(), `${pathDatabase}/${'data.realm'}`);

        let currentTime = moment().format("YYYYMMDDHHmmss");
        let zipPath = `${pathDatabase}`;
        let zipDestination = `${pathZip}/RealmPatroliApi${currentTime}.zip`;
        this.zipFile(zipPath.toString(), zipDestination.toString())
            .then((response) => {
                if (response.status) {
                    this.sendEmail(response.filePath, "PatroliApi", currentTime);
                }
            })
    }

    async zipFile(zipPath, zipDestination) {
        let zipStatus = {
            status: false,
            filePath: null
        };

        await zip(zipPath.toString(), zipDestination.toString())
            .then((path) => {
                zipStatus = {
                    status: true,
                    filePath: path
                };
            })
            .catch((error) => {
                console.log("ZIP ERR:", error)
            });


        return zipStatus;
    }

    sendEmail(filePath, Username, FileTime) {
        let formatDate = moment(FileTime, "YYYYMMDDHHmmss").format("DD MMM YY, HH:mm");
        try {
            Mailer.mail({
                subject: `Database - ${Username} - ${formatDate}`,
                recipients: ['TAP.callcenter.helpdesk@tap-agri.com'],
                ccRecipients: [''],
                bccRecipients: [''],
                body: `Berikut terlampir database Aplikasi Patroli Api saya ${Username} per ${formatDate}.`,
                isHTML: false,
                attachment: {
                    path: filePath,  // The absolute path of the file from which to read data.
                    type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                    name: null   // Optional: Custom filename for attachment
                }
            }, (error, event) => {
                return false
            });
            return true
        }
        catch (e) {
            return false
        }
    };

}
