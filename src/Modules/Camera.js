import React, { Component } from 'react';
import {AppRegistry, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';
import RealmServices  from '../Data/Realm/RealmServices';

import {copyFile} from '../Data/Function/FetchBlob';
import {pathImage, pathVideo} from '../Data/Constant/FilePath';

import {Icon} from '../UI/Widgets';
import * as COLOR from "../Data/Constant/Color";

export default class Camera extends Component {
    constructor(props){
        super(props);
        this.state={
            sessionID: props.route.params.patroliSession,
            type: "camera",
            videoStatus: false
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'black',
            }}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{
                        flex: 1,
                        justifyContent:"flex-end"
                    }}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor:"transparent"}}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.takePicture();
                            }}
                            onLongPress={()=>{
                                this.startVideo();
                            }}
                            onPressOut={()=>{
                                if(this.state.videoStatus){
                                    this.stopVideo();
                                }
                            }}
                            style={{
                                marginBottom: 20,
                                padding: 10,
                                backgroundColor:COLOR.WHITE,
                                borderRadius: 35,
                            }}
                        >
                            <Icon
                                iconSize={40}
                                iconName={this.state.type === "camera" ? "photo-camera" : "videocam"}
                            />
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }

    buttonAction(){
        switch (this.state.type) {
            case "camera":
                this.takePicture();
                break;
            case "video":
                if(!this.state.videoStatus){
                    this.startVideo();
                }
                else {
                    this.stopVideo();
                }
                break;
            default:
                break;
        }
    }

    async takePicture(){
        if (this.camera) {
            const options = { width: 640, quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            this.props.route.params.cameraAction(data.uri, "camera");
        }
    };

    async startVideo(){
        if (this.camera){
            this.setState({
                videoStatus: true
            },async ()=>{
                const options = {
                    quality: RNCamera.Constants.VideoQuality["480p"],
                    maxDuration: 10,
                };
                const data = await this.camera.recordAsync(options);
                this.props.route.params.cameraAction(data.uri, "video");
            })
        }
    }

    async stopVideo(){
        this.setState({
            videoStatus: false
        },()=>{
            this.camera.stopRecording();
        });
    }
}