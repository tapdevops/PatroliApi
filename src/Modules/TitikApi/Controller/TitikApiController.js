import moment from 'moment';
import RealmServices from "../../../Data/Realm/RealmServices";

function getActiveBA(){
    let BAdata = RealmServices.findByNonString("TABLE_BA", "ACTIVE", true);
    let baArray = Array.from(BAdata);
    return baArray;
}

function getTitikApi(){
    let titikApiData = RealmServices.getAllData("TABLE_TITIK_API");
    if(titikApiData){
        return Array.from(titikApiData);
    }
    return null
}

function getTitikApiBySession(sessionId){
    let titikApiData = RealmServices.findBy("TABLE_TITIK_API", "ID_SESSION", sessionId);
    return Array.from(titikApiData);
}

async function getTitikApiByWerks(listBACode){
    let tempTitikApi = [];
    await Promise.all(
        listBACode.map((bacode)=>{
            let titikApiData = RealmServices.findBy("TABLE_TITIK_API", "BA_CODE", bacode);
            if(titikApiData){
                tempTitikApi = [...tempTitikApi, ...Array.from(titikApiData)];
            }
        })
    );
    return tempTitikApi
}

function findTitikApiDetail(titikApiID){
    let titikApiDetail = RealmServices.query("TABLE_TITIK_API", `ID == "${titikApiID}" SORT(INSERT_TIME DESC)`);
    return Array.from(titikApiDetail);
}

function statusTitikApiPadam(titikApiID){
    let titikApiDetailDone = RealmServices.query("TABLE_TITIK_API", `ID == "${titikApiID}" AND STATUS_TITIK_API == "PADAM"`);
    return titikApiDetailDone && titikApiDetailDone.length > 0;
}

function findCameraData(cameraID){
    let imageData = RealmServices.findBySingle("TABLE_IMAGE", "ID", cameraID);
    let videoData = RealmServices.findBySingle("TABLE_VIDEO", "ID", cameraID);
    if(imageData){
        return {data:imageData, type:"photo"}
    }
    return {data:videoData, type:"video"}
}

function findTitikApiBasedOnLocation(keyword){
    let filterResult = RealmServices.query("TABLE_TITIK_API", `LOKASI BEGINSWITH "${keyword}"`);
    return Array.from(filterResult);
}

export default {
    statusTitikApiPadam,
    getActiveBA,
    getTitikApi,
    getTitikApiBySession,
    getTitikApiByWerks,
    findTitikApiDetail,
    findCameraData,
    findTitikApiBasedOnLocation
}