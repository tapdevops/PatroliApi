import {GoogleSignin, statusCodes} from "@react-native-community/google-signin";
import IMEI from 'react-native-imei';

import {URL_DEV ,SERVICE_LIST} from "../../../Data/API/Server";
import {get, getWithURL, post} from '../../../Data/API/FetchAxios';

import RealmServices from "../../../Data/Realm/RealmServices";

/*
    check if currently login as admin/patroli or not
    if authorized return admin/patroli(based on the user role) or false
*/
function loginAuthorized(){
    let userData = RealmServices.findFistIndex("TABLE_LOGIN");
    if(userData){
        return userData.AUTHORIZED === "YES" ? "admin" : "patroli";
    }
    else {
        return false;
    }
}

/*
    authentication login
    return auth validation (true/false)
*/
async function onLogin(username, password){
    let imei = await IMEI.getImei();
    if(username && password && imei[0] !== undefined && imei[0] !== null && imei[0] !== ""){
        let header = null;
        let request = {
            "username": username,
            "password": password,
            "imei": imei
        };

        return await post("AUTH-LOGIN",request, header)
            .then((response)=>{
                if(response.status){
                    return response.data;
                }
                return null
            })
    }
}

/*
    used to post user's data when login using google auth
*/
async function onLoginGoogle(userName, email){
    let imei = await IMEI.getImei();
    console.log(imei);
    if(userName && email && imei){
        let header = null;
        let request = {
            "EMAIL": email,
            "FULLNAME": userName,
            "IMEI": imei
        };

        return await post("SIGNUP-EMAIL",request, header)
            .then((response)=>{
                if(response.status){
                    return response.data;
                }
                return null
            })
    }
}

/*
    login via google
    return user data
*/
async function googleSignin(){
    GoogleSignin.configure({
        webClientId: "997383226987-o997403jp4fd5e67kbctfmi7vdebh8t3.apps.googleusercontent.com",
        offlineAccess: false,
    });
    await GoogleSignin.hasPlayServices();
    return await GoogleSignin.signIn()
        .then((userDetail)=>{
            if(userDetail.user.email){
                return userDetail
            }
            return null;
        })
        .catch((error)=>{
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
            return null;
        })
}

/*
    get Service list
    return list of Service
*/
async function getServiceList(){
    let SERVER = URL_DEV + SERVICE_LIST;
    let header = null;

    return await getWithURL(SERVER, header)
        .then(async (response)=>{
            if(response.status){
                if(RealmServices.getTotalData("TABLE_SERVICELIST") > 0){
                    RealmServices.deleteAllData("TABLE_SERVICELIST");
                }
                await Promise.all(
                    response.data.map((serviceData)=>{
                        RealmServices.saveData("TABLE_SERVICELIST", serviceData)
                    })
                );
                return true;
            }
            else {
                return null;
            }
        })
}

/*
    find specific BA
*/
function findBAList(BACode){
    let resultFindBA = null;
    if(BACode === "ALL"){
        resultFindBA = RealmServices.getAllData("TABLE_BA");
    }
    else {
        let codeFilter = RealmServices.query("TABLE_BA", `WERKS BEGINSWITH "${BACode.toString()}" SORT(WERKS ASC)`);
        let nameFilter = RealmServices.query("TABLE_BA", `EST_NAME BEGINSWITH "${BACode.toString().toUpperCase()}" SORT(WERKS ASC)`);
        resultFindBA = [...Array.from(codeFilter), ...Array.from(nameFilter)];
    }

    return resultFindBA;
}

/*
    get jalur BA
    return list of jalur BA
    firstSync: klo true -> bakal tarik smua data, false cuma data baru
*/
async function getJalurBA(BACodeArray, token){
    let successFetch = true;

    await Promise.all(
        BACodeArray.map(async (BACode)=>{
            let firstSync = RealmServices.getTotalData("TABLE_ROUTE") === 0;

            let header = {
                Authorization: `Bearer ${token}`
            };
            let request = {
                "BA_CODE": BACode,
                "FIRST_SYNC": firstSync
            };

            await post("GET-CHECKPOINT",request, header)
                .then(async (response)=>{
                    if(response.status){
                        if(response.data.length > 0){
                            await Promise.all(
                                response.data.map((checkPointData)=>{
                                    checkPointData.COORDINATES.map((routeData, indexCoordinate)=>{
                                        let tempRoute = {
                                            LATITUDE: routeData.LATITUDE,
                                            LONGITUDE: routeData.LONGITUDE,
                                            WERKS: checkPointData.BA_CODE,
                                            INDEX: indexCoordinate,
                                            JALUR : checkPointData.JALUR
                                        };
                                        RealmServices.saveData("TABLE_ROUTE", tempRoute);
                                    });
                                })
                            );
                        }
                        RealmServices.updateByPrimaryKey("TABLE_BA", {"WERKS": BACode, "ACTIVE": true, "DOWNLOAD": true});
                    }
                    else {
                        successFetch = false;
                    }
                });
        })
    );

    return successFetch;
}

/*
    save current user to realm db
*/
function saveCurrentUser(userData){
    if(userData){
        RealmServices.saveData("TABLE_LOGIN", userData);
        return true;
    }
}

export default {
    loginAuthorized,
    onLogin,
    onLoginGoogle,
    googleSignin,
    getServiceList,
    findBAList,
    getJalurBA,
    saveCurrentUser
}