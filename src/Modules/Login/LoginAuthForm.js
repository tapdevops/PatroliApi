import React, {Component} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {Icon, Text} from '../../UI/Widgets'
import {Alert} from '../../UI/Component';
import {RootContainer} from '../../UI/GlobalStyles';
import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {LOGO_APP} from "../../Asset";

import syncController from '../Controller/SyncController';
import loginController from './Controller/LoginController';

export default class LoginAuthForm extends Component{
    constructor(){
        super();
        this.state={
            userName: "sentot.santosa",
            password: "patroliapisquad",

            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            }
        }
    }

    async componentDidMount(): void {
        let x = await syncController.downloadListBA();
        console.log(x);
    }

    render(){
        return(
            <KeyboardAvoidingView
                behavior={"height"}
                style={{...RootContainer}}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.pop();
                    }}
                    style={{
                        height: 53,
                        paddingLeft: 10,
                        paddingTop: 10
                    }}>
                    <Icon
                        iconSize={SIZE.ICON_LARGE+30}
                        iconName="keyboard-arrow-left"
                        iconColor={COLOR.RED_1}
                    />
                </TouchableOpacity>
                <View style={[styles.Container, {marginTop: -53}]}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imageLogo}
                            source={LOGO_APP}
                            resizeMode={"stretch"}
                        />
                        <Text
                            style={styles.textLogo}
                            textFontFamily={"HEADER"}>
                            Patroli Api
                        </Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text
                            textSize={SIZE.TEXT_MEDIUM}
                            textFontFamily={"BOLD"}
                        >
                            Username
                        </Text>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                value={this.state.userName}
                                onChangeText={(value) => {
                                    this.setState({
                                        userName: value
                                    })
                                }}
                                placeholder={"Isi dengan username email anda"}
                            />
                        </View>
                        <Text
                            style={{
                                marginTop: 10
                            }}
                            textSize={SIZE.TEXT_MEDIUM}
                            textFontFamily={"BOLD"}
                        >
                            Password
                        </Text>
                        <View style={[styles.textInputContainer, {flexDirection:"row", justifyContent:"space-between"}]}>
                            <TextInput
                                value={this.state.password}
                                onChangeText={(value) => {
                                    this.setState({
                                        password: value
                                    })
                                }}
                                secureTextEntry={true}
                                placeholder={"Isi dengan password email anda"}
                            />
                        </View>
                        <View style={{marginTop: 10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    loginController.onLogin(this.state.userName, this.state.password)
                                        .then((userData)=>{
                                            if(userData){
                                                loginController.saveCurrentUser(userData);
                                                this.props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 1,
                                                        routes: [
                                                            { name: 'DashboardAdmin' }
                                                        ]
                                                    })
                                                );
                                            }
                                            else {
                                                this.setState({
                                                    alertModal: {
                                                        ...this.state.alertModal,
                                                        visible: true,
                                                        title: "Login Gagal",
                                                        description: "Cek koneksi anda / credential anda"
                                                    }
                                                })
                                            }
                                        });
                                }}
                                style={[
                                    styles.button_main,
                                    {backgroundColor:COLOR.RED_1, marginTop: 15}
                                ]}>
                                <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Masuk Aplikasi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Alert
                    action={()=>{this.setState({
                        alertModal: {...this.state.alertModal, visible: false}
                    })}}
                    visible={this.state.alertModal.visible}
                    alertTitle={this.state.alertModal.title}
                    alertDescription={this.state.alertModal.description}
                    alertIcon={require('../../Asset/Alert/login_error.png')}
                />
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    Container:{
        flex: 1,
        paddingHorizontal: "15%"
    },
    imageContainer:{
        flex: 1,
        justifyContent:"center"
    },
    mainContainer:{
        flex: 1
    },
    textInputContainer: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor:COLOR.GREY
    },
    button_main:{
        width: 225,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
        alignSelf:"center",
        alignItems:"center",
        marginVertical: 5
    },
    imageLogo:{
        marginLeft: -50,
        width: 200,
        height: 200
    },
    textLogo:{
        marginTop: -15,
        fontSize: SIZE.TEXT_LARGE_LOGIN_ONBOARDING
    }
});