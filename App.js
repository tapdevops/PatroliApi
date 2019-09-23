import React, {Component} from 'react';
import Navigator from './src/Navigation/Navigator';

import {getPermission} from './src/Data/Function/Permission';
import {directoryPatroli} from './src/Data/Constant/FilePath';
import {createDirectory} from './src/Data/Function/FetchBlob';
import Geolocation from "@react-native-community/geolocation";

export default class App extends Component{
    constructor(){
        super();
    }

    async componentDidMount(){
        // this.startWatchPosition();
        this.initDirectory();
        await this.permissionRequest();
    }

    render(){
        return <Navigator/>
    }

    async permissionRequest(){
        await getPermission()
            .then((response)=>{
                if(!response){
                    alert("Permission harus di hidupkan!")
                }
            })
    }

    initDirectory(){
        createDirectory(directoryPatroli)
            .then((response)=>{})
    }

    //di pake buat update gps getcurrentposition tiap detik. ga ada ini geolocation getcurrentposition gk ke update!
    //di pake juga untuk cek mock gps
    // startWatchPosition(){
    //     Geolocation.watchPosition(
    //         (geolocation)=>{
    //             alert(JSON.stringify(geolocation))
    //         },
    //         (e)=>{
    //             alert("ERR",e);
    //         },
    //         { enableHighAccuracy: true, timeout: 1000, maximumAge: 0, distanceFilter: 1}
    //     )
    // }
}
