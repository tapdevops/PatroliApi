import React, {Component} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {getServiceList} from '../../Data/API/FetchAxios';
import loginController from './Controller/LoginController';

import {LOGO_APP} from '../../Asset'
import {Icon, Text} from '../../UI/Widgets'
import {ModalLoading} from '../../UI/Modal'
import {ModalAreaLokasi} from './Modal/BoardingPage_AreaLokasi';
import {RootContainer} from '../../UI/GlobalStyles';
import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';
import {Alert} from "../../UI/Component";
import syncController from "../Controller/SyncController";


export default class LoginLocationForm extends Component{
    constructor(){
        super();
        this.state={
            googleUserData: null,
            selectedBA: null,
            BAList: [],
            modalVisible: false,
            areaPatroli: null,

            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            },
            showLoading: false
        }
    }

    async componentDidMount(){
        await syncController.downloadListBA();

        this.setState({
            googleUserData: this.props.route.params.userDetail.user
        });
    }

    async goTo(route){
        switch(route){
            case "Dashboard":
                if(this.state.selectedBA){
                    this.setState({
                        showLoading: true
                    });
                    let googleLogin = await loginController.onLoginGoogle(`${this.state.googleUserData.givenName} ${this.state.googleUserData.familyName}`, this.state.googleUserData.email);
                    if(googleLogin){
                        let getRoute = await loginController.getJalurBA(this.state.selectedBA, googleLogin.ACCESS_TOKEN);
                        if(getRoute){
                            loginController.saveCurrentUser(googleLogin);
                            this.setState({
                                showLoading: false
                            },()=>{
                                return this.props.navigation.dispatch(
                                    CommonActions.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'DashboardPatroli' }
                                        ]
                                    })
                                )
                            });
                        }
                        else {
                            return null;
                        }
                    }
                    return null;
                }
                this.setState({
                    alertModal: {
                        ...this.state.alertModal,
                        visible: true,
                        title: "Area patroli belum di pilih",
                        description: "Pilih area patroli terlebih dahulu!"
                    }
                });
                return null;
            case "LoginAuthForm":
                return(
                    this.props.navigation.navigate("LoginAuthForm")
                );
        }
    }

    render(){
        return(
            <View
                style={styles.Container}>
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
                    <Text textFontFamily={"BOLD"}>Email</Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            value={this.state.googleUserData ? this.state.googleUserData.email : null}
                            onChangeText={(value) => {
                                this.setState({
                                    userName: value
                                })
                            }}
                            editable={false}
                            placeholder={"Isi nama lengkap anda"}
                        />
                    </View>
                    <Text
                        style={{
                            marginTop: 10
                        }}
                        textFontFamily={"BOLD"}>
                        Area Patroli
                    </Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                modalVisible: true
                            })
                        }}
                        style={[
                            styles.textInputContainer,
                            {flexDirection:"row", justifyContent:"space-between"}
                        ]}>
                        <TextInput
                            value={this.state.selectedBA ? this.state.selectedBA.join(",") : null}
                            onChangeText={(value) => {
                                this.setState({
                                    userName: value
                                })
                            }}
                            placeholder={"Pilih lokasi"}
                            editable={false}
                        />
                        <Icon
                            style={{alignSelf: "center"}}
                            iconName={"arrow-drop-down"}
                            iconSize={SIZE.ICON_LARGE}
                            iconColor={COLOR.GREY}
                        />
                    </TouchableOpacity>
                    <View style={{alignItems:"center", justifyContent:"space-evenly", marginTop: 10}}>
                        <TouchableOpacity
                            onPress={()=>this.goTo("Dashboard")}
                            style={[
                                styles.button_main,
                                {backgroundColor:COLOR.RED_1, marginTop: 15}
                            ]}>
                            <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Saya siap patroli</Text>
                        </TouchableOpacity>
                        <Text>Atau</Text>
                        <TouchableOpacity
                            onPress={()=>this.goTo("LoginAuthForm")}
                            style={[
                                styles.button_main,
                                {backgroundColor:COLOR.GREY}
                            ]}>
                            <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Login User Terdaftar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ModalAreaLokasi
                    visible={this.state.modalVisible}
                    modalAction={(value)=>{
                        this.setState({
                            modalVisible: false,
                            selectedBA: value
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
                />
                <ModalLoading
                    show={this.state.showLoading}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container:{
        ...RootContainer,
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