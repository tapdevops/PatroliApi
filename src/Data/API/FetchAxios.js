import axios from 'axios';
import {SERVICE_LIST, URL_DEV} from './Server';
import MSG from './MessageConstant';

import RealmServices from '../Realm/RealmServices';
import FilePath from "../Constant/FilePath";
import RNFetchBlob from "rn-fetch-blob";

const SERVER = URL_DEV;

/*
    fetch result template
*/
function fetchResult(status, message, data){
    return({
        status: status,
        message: message,
        data: data
    })
}

/*
    get service data
*/
function getService(serviceName){
    let serviceData = RealmServices.findBySingle("TABLE_SERVICELIST", "API_NAME", serviceName);
    return serviceData;
}

// get / refresh servicelist
async function getServiceList(){
    let responseStatus = {
        status: false,
        data: null,
        message: null
    };

    await axios.get(`${SERVER}${SERVICE_LIST}`)
        .then(async (serverResponse)=>{
            let response = serverResponse.data;
            if(response){
                if(response.data.length > 0){
                    if(RealmServices.getTotalData("TABLE_SERVICELIST") > 0){
                        RealmServices.deleteAllData("TABLE_SERVICELIST");
                    }
                    await Promise.all(
                        response.data.map((serviceData)=>{
                            RealmServices.saveData("TABLE_SERVICELIST", serviceData)
                        })
                    )
                    responseStatus = {...responseStatus, status: true}
                }
            }
        })
        .catch((error)=>{
            responseStatus = {...responseStatus, status: true}
        })

    return responseStatus;
}

/*
    fetch POST axios
    return fetchResult()
*/
async function post(serviceName, request, header){
    let serviceData = getService(serviceName);
    if(serviceData){
        return await axios({
            method: 'POST',
            url: serviceData.API_URL,
            headers: header ? header : null,
            data: request
        }).then((serverResponse)=>{
            let response = serverResponse.data;
            switch (response.status) {
                case true:
                    return fetchResult(true, response.message, response.data);
                case false:
                    return fetchResult(false, MSG.ERR_STATUS_FALSE, null);
                default:
                    return fetchResult(false, MSG.ERR_STATUS_DEFAULT, null);
            }
        }).catch((error)=>{
            return fetchResult(false, MSG.ERR_CATCH(error), null);
        });
    }
}

/*
    fetch PUT axios
    return fetchResult()
*/
async function put(serviceName, request, header){
    let serviceData = getService(serviceName);
    if(serviceData){
        return await axios({
            method: 'PUT',
            url: serviceData.API_URL,
            headers: header ? header : null,
            data: request
        }).then((serverResponse)=>{
            let response = serverResponse.data;
            switch (response.status) {
                case true:
                    return fetchResult(true, response.message, response.data);
                case false:
                    return fetchResult(false, MSG.ERR_STATUS_FALSE, null);
                default:
                    return fetchResult(false, MSG.ERR_STATUS_DEFAULT, null);
            }
        }).catch((error)=>{
            return fetchResult(false, MSG.ERR_CATCH(error), null);
        });
    }
}

/*
    fetch GET axios
    return fetchResult()
*/
async function get(serviceName, header){
    let serviceData = getService(serviceName);
    if(serviceData){
        return await axios({
            method: 'GET',
            url: serviceData.API_URL,
            headers: header ? header : null
        }).then((serverResponse)=>{
                let response = serverResponse.data;
                switch (response.status) {
                    case true:
                        return fetchResult(true, MSG.SUCCESS_GET, response.data);
                    case false:
                        return fetchResult(false, MSG.ERR_STATUS_FALSE, null);
                    default:
                        return fetchResult(false, MSG.ERR_STATUS_DEFAULT, null);
                }
            })
            .catch((error)=>{
                return fetchResult(false, MSG.ERR_CATCH(error), null);
            })
    }
}

/*
    fetch GET with custom url axios
    return fetchResult()
*/
async function getWithURL(URL, header){
    if(URL){
        return await axios({
            method: 'GET',
            url: URL,
            headers: header ? header : null
        }).then((serverResponse)=>{
            let response = serverResponse.data;
            switch (response.status) {
                case true:
                    return fetchResult(true, MSG.SUCCESS_GET, response.data);
                case false:
                    return fetchResult(false, MSG.ERR_STATUS_FALSE, null);
                default:
                    return fetchResult(false, MSG.ERR_STATUS_DEFAULT, null);
            }
        })
            .catch((error)=>{
                return fetchResult(false, MSG.ERR_CATCH(error), null);
            })
    }
}

async function downloadImage(filePath, fileURL){
    let syncStatus = false;
    let options = {
        fileCache: false,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: filePath,
            description: 'Titik Api Image'
        }
    };
    await RNFetchBlob.config(options)
        .fetch('GET', fileURL)
        .then((res) => {
            syncStatus = true
        })
        .catch((error) => {});

    return syncStatus;
}

export {
    getServiceList,
    post,
    put,
    get,
    getWithURL,
    downloadImage
}