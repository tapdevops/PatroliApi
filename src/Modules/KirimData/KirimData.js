import React, {Component} from 'react';
import {Text, View, Image, FlatList, TouchableOpacity} from 'react-native';

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
        }
    }

    componentDidMount(): void {
        this.getAllSession();
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
                                    <Text>{item.NAME+"_"+item.ID}</Text>
                                    <TouchableOpacity
                                        onPress={async ()=>{
                                            let fileName = item.NAME+"_"+item.ID+".kml";
                                            let fileData = await this.generateKMLData(item.ID, item.NAME);
                                            this.generateKMLFile(fileName.toString(), fileData.toString());
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
        let sessionData = RealmServices.getAllData("TABLE_SESSION");
        this.setState({
            sessionList: sessionData
        });
    }

    generateKMLFile(fileName, fileData){
        let finalPath = directoryKML + "/" + fileName;
        createFileUTF8(finalPath, fileData)
            .then((response)=>{
                console.log("GENERATE KML", response);
            })
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

}
