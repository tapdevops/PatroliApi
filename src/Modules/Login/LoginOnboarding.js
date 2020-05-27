import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import loginController from './Controller/LoginController';
import geoJSONController from '../Controller/GeoJSONController';

import {LOGO_APP} from '../../Asset'
import {Text} from '../../UI/Widgets'
import {Alert} from '../../UI/Component';
import {RootContainer} from '../../UI/GlobalStyles';
import * as SIZE from '../../Data/Constant/Size';
import * as COLOR from '../../Data/Constant/Color';

import RealmServices from "../../Data/Realm/RealmServices";

export default class LoginOnboarding extends Component{
    constructor(){
        super();
        this.state={
            alertModal: {
                visible: false,
                title: null,
                description: null,
                action: null
            }
        }
    }

    async componentDidMount(){
        await this.getServiceList();
        let adminStatus = loginController.loginAuthorized();
        if(adminStatus){
            switch (adminStatus) {
                case "admin":
                    return this.goTo("DashboardAdmin");
                case "patroli":
                    return this.goTo("DashboardPatroli");
                default:
                    break;
            }
        }
    }

    goTo(route){
        switch (route) {
            case "LoginLocationForm":
                return loginController.googleSignin()
                    .then((userDetail)=>{
                        if(userDetail){
                            this.props.navigation.navigate("LoginLocationForm", {userDetail: userDetail})
                        }
                    });
            case "LoginAuthForm":
                return this.props.navigation.navigate("LoginAuthForm");
            case "DashboardAdmin":
                return this.props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'DashboardAdmin' }
                            ]
                        })
                    );
            case "DashboardPatroli":
                return this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'DashboardPatroli' }
                        ]
                    })
                );
        }
    }

    async getServiceList(){
        let serviceListExist = RealmServices.getTotalData("TABLE_SERVICELIST") > 0;
        if(serviceListExist){
            return true
        }
        else {
            let responseServiceList = await loginController.getServiceList();
            if(!responseServiceList){
                this.setState({
                    alertModal: {
                        ...this.state.alertModal,
                        visible: true,
                        title: "Gagal mendapatkan Service List",
                        description: "Service list tidak bisa di download!"
                    }
                }, async ()=>{
                    await loginController.getServiceList();
                });
            }
            return responseServiceList;
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
                        textLabel={"Patroli Api"}
                        textFontFamily={"HEADER"}
                    />
                </View>
                <View style={styles.mainContainer}>
                    <View style={{alignItems:"center", justifyContent:"space-evenly", marginTop: 10}}>
                        <TouchableOpacity
                            onPress={()=>this.goTo("LoginLocationForm")}
                            style={[
                                styles.button_main,
                                {backgroundColor:COLOR.RED_1, marginTop: 15}
                            ]}>
                            <Text style={{fontSize:SIZE.ICON_MEDIUM, color:COLOR.WHITE}}>Login Google</Text>
                        </TouchableOpacity>
                        <Text>Atau</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                this.goTo("LoginAuthForm");
                            }}
                            style={[
                                styles.button_main,
                                {backgroundColor:COLOR.GREY}
                            ]}>
                            <Text
                                style={{
                                    fontSize:SIZE.ICON_MEDIUM,
                                    color:COLOR.WHITE
                                }}
                                textLabel={"Login User Terdaftar"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Alert
                    action={()=>{
                        this.setState({
                            alertModal: {
                                ...this.state.alertModal,
                                visible: false
                            }
                        })
                    }}
                    visible={this.state.alertModal.visible}
                    alertTitle={this.state.alertModal.title}
                    alertDescription={this.state.alertModal.description}
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