import React, {Component} from 'react';
import {Text, View, Image, FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Mailer from 'react-native-mail';

import {createFileUTF8} from '../../Data/Function/FetchBlob';
import {directoryKML} from '../../Data/Constant/FilePath';

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
                                        onPress={async ()=>{
                                            let fileName = item.NAME+"_"+item.ID.replace("P","")+".kml";
                                            let filePath = directoryKML + "/" + fileName;
                                            let fileData = await this.generateKMLData(item.ID, item.NAME);
                                            console.log("filepath1", filePath);
                                            this.generateKMLFile(filePath.toString(), fileData.toString())
                                                .then((response)=>{
                                                    if(response){
                                                        // this.props.navigation.navigate("Patroli")
                                                        this.handleEmail(filePath, fileName, item);
                                                    }
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

    async generateKMLFile(filePath, fileData){
        let status = false;
        await createFileUTF8(filePath, fileData)
            .then((response)=>{
                status = true
            })
            .catch((e)=>{
                status = false;
            });

        return status
    }

    async generateKMLData(sessionID, userName){
        let stringTitikApi = "";
        let garisCoordinate = "";

        //TITIK API
        let getTitikApi = RealmServices.query("TABLE_COORDINATE", `ID_SESSION = "${sessionID}" AND FIRE_STATUS = "Y"`).sorted("INSERT_TIME", false);
        await Promise.all(
            getTitikApi.map((data, index)=>{
                let titikApi = `<?xml version="1.0" encoding="UTF-8"?>
<Placemark>
    <name>TITIK API ${index+1}</name>
    <Point>
        <coordinates>
            ${data.LONGITUDE},${data.LATITUDE}
        </coordinates>
    </Point>
</Placemark>\n`;
                stringTitikApi = stringTitikApi + titikApi.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");
            })
        );
        //LINE
        let getCoordinate = RealmServices.findBy("TABLE_COORDINATE", "ID_SESSION", sessionID).sorted("INSERT_TIME", false);
        await Promise.all(
            getCoordinate.map((data, index)=>{
                if (getCoordinate.length < index){
                    garisCoordinate = garisCoordinate + `${data.LONGITUDE.toString()},${data.LATITUDE.toString()}\n`
                }
                else {
                    garisCoordinate = garisCoordinate + `${data.LONGITUDE.toString()},${data.LATITUDE.toString()}\n`
                }
            })
        );

        let finalKMLString = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">

<Document>
    <name>${userName}_${sessionID}</name>
    ${stringTitikApi}
    <Style id="yellowLineGreenPoly">
        <LineStyle>
            <color>7f00ffff</color>
            <width>4</width>
        </LineStyle>
        <PolyStyle>
            <color>7f00ff00</color>
        </PolyStyle>
    </Style>
    <Placemark>
        <name>Absolute Extruded</name>
        <description>Transparent green wall with yellow outlines</description>
        <styleUrl>#yellowLineGreenPoly</styleUrl>
        <LineString>
            <extrude>1</extrude>
            <tessellate>1</tessellate>
            <altitudeMode>absolute</altitudeMode>
            <coordinates>
                ${garisCoordinate}
            </coordinates>
        </LineString>
    </Placemark>
</Document>
</kml>`;

        return finalKMLString;
    }

    handleEmail(filePath, fileName, sessionData){
        let formatDate = moment(sessionData.INSERT_TIME, "YYYYMMDDHHmmss").format("DD MMM YY, HH:mm");
        Mailer.mail({
            subject: `Patroli Api - ${sessionData.NAME} - ${formatDate}`,
            recipients: ['hotspot@tap-agri.com'],
            ccRecipients: [''],
            bccRecipients: [''],
            body: `Dengan ini saya ${sessionData.NAME} menyatakan telah melakukan patroli api\npada ${formatDate}.\nTerlampir hasil patroli saya.`,
            isHTML: false,
            attachment: {
                path: filePath,  // The absolute path of the file from which to read data.
                type: 'kml',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                name: fileName,   // Optional: Custom filename for attachment
            }
        }, (error, event) => {
            console.log(event);
            console.log('OK: Email Error Response');
            console.log('CANCEL: Email Error Response');
        });
    };

    sendMail(){
    }
}
