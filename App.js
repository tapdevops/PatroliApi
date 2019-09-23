import React, {Component} from 'react';
import Navigator from './src/Navigation/Navigator';

import {getPermission} from './src/Data/Function/Permission';
import {directoryPatroli} from './src/Data/Constant/FilePath';
import {createDirectory} from './src/Data/Function/FetchBlob';

export default class App extends Component{
    constructor(){
        super();
    }

    async componentDidMount(){
        await this.permissionRequest();
        this.initDirectory();
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
}
