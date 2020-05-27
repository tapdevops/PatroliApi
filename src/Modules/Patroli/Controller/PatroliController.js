import RealmServices from "../../../Data/Realm/RealmServices";
import {post} from "../../../Data/API/FetchAxios";
import moment from "moment";

import {copyFile} from '../../../Data/Function/FetchBlob';
import {pathImage, pathVideo} from '../../../Data/Constant/FilePath';

function getSession(sessionID){
    let sessionData = RealmServices.findBySingle("TABLE_SESSION", "ID", sessionID);
    return sessionData;
}

/*
    return list werks yang sudah di download
*/
function getActiveWerks(){
    let activeWerks = RealmServices.findByNonString("TABLE_BA", "ACTIVE", true );
    return Array.from(activeWerks);
}

/*
    return list coordinate jalur
*/
function getJalur(BACode, Jalur){
    let jalurData = RealmServices.query("TABLE_ROUTE", `WERKS == "${BACode}" AND JALUR == "${Jalur}"`);
    let tempArrayJalurData = Array.from(jalurData);
    let arrayJalurData = [];
    tempArrayJalurData.forEach((item)=>{
        arrayJalurData.push({
            latitude: item.LATITUDE,
            longitude: item.LONGITUDE
        })
    });
    return arrayJalurData;
}

function getJalurCoordinate(sessionID){
    let coordinateData = RealmServices.findBy("TABLE_TRACK", "ID_SESSION", sessionID);
    let tempArrayJalurData = Array.from(coordinateData);
    let arrayCoordinateData = [];
    tempArrayJalurData.forEach((item)=>{
        arrayCoordinateData.push({
            latitude: item.LATITUDE,
            longitude: item.LONGITUDE
        })
    });
    return arrayCoordinateData;
}

/*
    return berapa banyak jalur di bacode
*/
function getNoOfJalur(BACode){
    let jalurData = RealmServices.query("TABLE_ROUTE", `WERKS == "${BACode}" DISTINCT(JALUR)`);
    return Array.from(jalurData);
}

function getTitikApiCount(sessionID){
    // let titikApiCount = RealmServices.findBy("TABLE_TITIK_API", "ID_SESSION", sessionID);
    let titikApiCount = RealmServices.query("TABLE_TITIK_API", `ID_SESSION == "${sessionID}" DISTINCT(ID)`);
    return Array.from(titikApiCount).length;
}

function savePatroliSession(patroliSessionData){
    let userData = RealmServices.getLogin();
    let sessionModel = {
        ID: patroliSessionData.sessionID.toString(),
        NAME: userData.EMPLOYEE_FULLNAME,
        JALUR: patroliSessionData.selectedJalur,
        WERKS: patroliSessionData.selectedWerks,
        DURASI: patroliSessionData.duration,
        JARAK: "0",
        INSERT_TIME: moment().format("YYYYMMDDHHmmss")
    };
    RealmServices.saveData("TABLE_SESSION", sessionModel);
}

function saveTitikApi(titikApiData){
    RealmServices.saveData("TABLE_TITIK_API", titikApiData);
}

async function saveTitikApiCamera(type, cameraData, src){
    if(type === "camera"){
        let tempCameraData = {
            ...cameraData,
            IMAGE_LOCAL_PATH: `${pathImage}/${cameraData.IMAGE_NAME}`,
        };
        await copyFile(src, `${pathImage}/${cameraData.IMAGE_NAME}`);
        RealmServices.saveData("TABLE_IMAGE", tempCameraData);
    }
    else if(type === "video") {
        let tempCameraData = {
            ...cameraData,
            VIDEO_LOCAL_PATH: `${pathVideo}/${cameraData.VIDEO_NAME}`,
        };
        await copyFile(src, `${pathVideo}/${cameraData.VIDEO_NAME}`);
        console.log(`${pathVideo}/${cameraData.VIDEO_NAME}`);
        RealmServices.saveData("TABLE_VIDEO", tempCameraData);
    }
}

//update durasi dan jarak patroli
function updateSessionPatroli(sessionID, jarak, durasi){
    RealmServices.updateByPrimaryKey("TABLE_SESSION", {ID: sessionID.toString(), DURASI: durasi.toString(), JARAK: jarak.toString()})
}

export default {
    getSession,
    getActiveWerks,
    getJalur,
    getJalurCoordinate,
    getNoOfJalur,
    getTitikApiCount,
    savePatroliSession,
    saveTitikApi,
    saveTitikApiCamera,
    updateSessionPatroli
}