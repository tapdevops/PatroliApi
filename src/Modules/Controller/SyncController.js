import moment from 'moment';
import fetchBlob from '../../Data/Function/FetchBlob';
import FilePath from '../../Data/Constant/FilePath';
import {get, post, downloadImage} from '../../Data/API/FetchAxios';
import RealmServices from '../../Data/Realm/RealmServices';

async function uploadTitikApi(){
    let syncStatus = true;

    let token = RealmServices.getLoginToken();
    let getTitikApi = RealmServices.findByNonString("TABLE_TITIK_API", "SYNC_STATUS", false);

    if(token && getTitikApi){
        await Promise.all(
            getTitikApi.map(async(titikApiData)=>{
                let idJalur = titikApiData.ID[titikApiData.ID.length-1];
                let header = {
                    Authorization: `Bearer ${token}`
                };

                let request = {
                    "TRACK_CODE": titikApiData.ID_SESSION,
                    "TITIK_API_ID": titikApiData.ID,
                    "BA_CODE": titikApiData.BA_CODE,
                    "JALUR": idJalur,
                    "LATITUDE": titikApiData.LATITUDE.toString(),
                    "LONGITUDE": titikApiData.LONGITUDE.toString(),
                    "DATE": titikApiData.DATE,
                    "STATUS_TITIK_API": titikApiData.STATUS_TITIK_API,
                    "LUAS_AREA": parseFloat(titikApiData.LUAS_AREA),
                    "LOKASI": titikApiData.LOKASI,
                    "KETERANGAN": titikApiData.KETERANGAN,
                    "LAPOR_PIHAK_BERWAJIB": titikApiData.LAPOR_PIHAK_BERWAJIB,
                    "SYNC_TIME": parseFloat(moment().format("YYYYMMDDHHmmss")),
                    "INSERT_TIME": parseFloat(titikApiData.INSERT_TIME)
                };

                await post("UPLOAD-TITIK-API",request, header)
                    .then(async (response)=>{
                        if(response.status){
                            RealmServices.updateByPrimaryKey("TABLE_TITIK_API", {"UNIQUE_TAG": titikApiData.UNIQUE_TAG, "SYNC_STATUS": true});
                        }
                        syncStatus = response.status
                    });
            })
        );
    }
    else {
        syncStatus = false;
    }
    return syncStatus;
}

async function uploadImage(){
    let syncStatus = true;
    let token = RealmServices.getLoginToken();
    let getImages = RealmServices.findByNonString("TABLE_IMAGE", "SYNC_STATUS", false);
    if(token && getImages){
        await Promise.all(
            getImages.map(async(imageData)=>{
                let header = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":'application/x-www-form-urlencoded'
                };

                let request = new FormData();
                request.append('TITIK_API_ID', imageData.RELATION_ID);
                request.append('INSERT_TIME', imageData.INSERT_TIME);
                request.append('IMAGES', {
                    uri: `file://${imageData.IMAGE_LOCAL_PATH}`,
                    type: 'image/jpeg',
                    name: imageData.IMAGE_NAME,
                });

                await post("UPLOAD-IMAGE",request, header)
                    .then(async (response)=>{
                        if(response.status){
                            RealmServices.updateByPrimaryKey("TABLE_IMAGE", {"ID": imageData.ID, "SYNC_STATUS": true});
                        }
                        syncStatus = response.status
                    });
            })
        );
    }
    else {
        syncStatus = false;
    }
    return syncStatus;
}

async function uploadVideo(){
    let syncStatus = true;
    let token = RealmServices.getLoginToken();
    let getVideo = RealmServices.findByNonString("TABLE_VIDEO", "SYNC_STATUS", false);

    if(token && getVideo){
        await Promise.all(
            getVideo.map(async(videoData)=>{
                let header = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":'application/x-www-form-urlencoded'
                };

                let request = new FormData();
                request.append('TITIK_API_ID', videoData.RELATION_ID);
                request.append('INSERT_TIME', videoData.INSERT_TIME);
                request.append('VIDEOS', {
                    uri: `file://${videoData.VIDEO_LOCAL_PATH}`,
                    type: 'video/mp4',
                    name: videoData.VIDEO_NAME,
                });

                await post("UPLOAD-VIDEO",request, header)
                    .then(async (response)=>{
                        if(response.status){
                            RealmServices.updateByPrimaryKey("TABLE_VIDEO", {"ID": videoData.ID, "SYNC_STATUS": true});
                        }
                        syncStatus = response.status;
                    });
            })
        );
    }
    else {
        syncStatus = false;
    }
    return syncStatus;
}

async function uploadTrack(){
    let syncStatus = true;
    let sessionData = RealmServices.findByNonString("TABLE_SESSION", "TRACK_SYNC", false);
    let accessToken = RealmServices.getLogin().ACCESS_TOKEN;

    if(sessionData && accessToken){
        await Promise.all(
            sessionData.map(async (session)=>{
                let getNoTitikApi = RealmServices.findBy("TABLE_TITIK_API", "ID_SESSION", session.ID);

                let tempJarak = session.JARAK/1000;
                let header = {
                    Authorization: `Bearer ${accessToken}`
                };
                let request = {
                    "TRACK_CODE": session.ID,
                    "BA_CODE": session.WERKS,
                    "JALUR": session.JALUR,
                    "DURATION": moment.duration(session.DURASI).asSeconds().toString(),
                    "JARAK": tempJarak.toString(),
                    "JUMLAH_TITIK_API": getNoTitikApi.length,
                    "LAT_LONG_DATE": await _getTrackCoordinate(session.ID)
                };
                await post("UPLOAD-TRACKING", request, header)
                    .then((response)=>{
                        if(response.status){
                            RealmServices.updateByPrimaryKey("TABLE_SESSION", {
                                ID: session.ID,
                                TRACK_SYNC: true,
                                CHECKPOINT: response.data.CHECKPOINT
                            });
                        }
                        syncStatus = response.status;
                    });
            })
        );
    }
    else {
        syncStatus = false;
    }
    return syncStatus
}

/*
    get BA list
    return list of BA
*/
async function downloadListBA(){
    let syncStatus = true;
    let header = null;

    await get("PATROLI-SYNC-BA", header)
        .then(async (response)=>{
            if(response.status){
                await Promise.all(
                    response.data.map((BAData)=>{
                        let isExist = RealmServices.findBySingle("TABLE_BA", "WERKS", BAData.WERKS);
                        if(!isExist){
                            let tempBA = {
                                "EST_NAME": BAData.EST_NAME,
                                "WERKS": BAData.WERKS,
                                "ACTIVE": false,
                                "DOWNLOAD": false,
                            };
                            RealmServices.saveData("TABLE_BA", tempBA);
                        }
                    })
                );
            }
            else {
                syncStatus = false;
            }
        });

    return syncStatus;
}

async function downloadJalurPatroli(BACodeArray){
    let syncStatus = true;
    let accessToken = RealmServices.getLoginToken();
    // let successFetch = true;

    await Promise.all(
        BACodeArray.map(async (BACode)=>{
            let firstSync = RealmServices.getTotalData("TABLE_ROUTE") === 0;

            let header = {
                Authorization: `Bearer ${accessToken}`
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
                    }
                    else {
                        syncStatus = false;
                    }
                });

            RealmServices.updateByPrimaryKey("TABLE_BA", {"WERKS": BACode, "ACTIVE": true, "DOWNLOAD": true});
        })
    );

    return syncStatus;
}

async function _getTrackCoordinate(idSession){
    let coordinateTrack = RealmServices.findBy("TABLE_TRACK", "ID_SESSION", idSession);
    let tempCoordinateTrack = [];
    await Promise.all(
        coordinateTrack.map((coordinate)=>{
            tempCoordinateTrack.push({
                "LAT": coordinate.LATITUDE.toString(),
                "LONG": coordinate.LONGITUDE.toString(),
                "DATE": coordinate.INSERT_TIME
            })
        })
    );
    return tempCoordinateTrack;
}

async function downloadTitikApi(){
    let syncStatus = true;
    let accessToken = RealmServices.getLoginToken();
    let latestSyncTime = RealmServices.findBySingle("TABLE_SYNC", "TABLE_NAME", "TABLE_TITIK_API");
    let header = {
        Authorization: `Bearer ${accessToken}`
    };

    let request = {
        "FIRST_SYNC": !latestSyncTime
    };

    await post("DOWNLOAD-TITIK-API", request, header)
        .then(async (response)=>{
            let uniqueNo = 0;
            if(response.status){
                await Promise.all(
                    response.data.map(async (listTitikApi)=>{
                        await Promise.all(
                            listTitikApi.map(async (titikApi)=>{
                                //pengencekan klo titik api dengan id dan insert time yg sama udh ada di skip.
                                let titikApiExist = RealmServices.query("TABLE_TITIK_API", `ID == "${titikApi.TITIK_API_ID}" AND INSERT_TIME == "${titikApi.INSERT_TIME.toString()}"`);
                                if(titikApiExist.length === 0){
                                    let tempTitikApi = {
                                        ID: titikApi.TITIK_API_ID,
                                        ID_SESSION: titikApi.TRACK_CODE,
                                        BA_CODE: titikApi.BA_CODE,
                                        LONGITUDE: parseFloat(titikApi.LONG),
                                        LATITUDE: parseFloat(titikApi.LAT),
                                        DATE: titikApi.DATE.toString(),
                                        INSERT_TIME: titikApi.INSERT_TIME.toString(),
                                        LUAS_AREA: titikApi.LUAS_AREA.toString(),
                                        LOKASI: titikApi.LOKASI,
                                        KETERANGAN: titikApi.KETERANGAN,
                                        STATUS_TITIK_API: titikApi.STATUS_TITIK_API,
                                        LAPOR_PIHAK_BERWAJIB: titikApi.LAPOR_PIHAK_BERWAJIB,

                                        UNIQUE_TAG: `API${moment().format("YYYYMMDDHHmmss")}${uniqueNo}`,
                                        SYNC_STATUS: true,
                                        EMPLOYEE_FULLNAME: titikApi.EMPLOYEE_FULLNAME,
                                        INSERT_USER: titikApi.INSERT_USER
                                    };
                                    uniqueNo++;
                                    let parentTitikApi = {...tempTitikApi, FILE_NAME: titikApi.FILE_NAME, URL: titikApi.URL}
                                    if(titikApi.TYPE === "IMAGE"){
                                        await _downloadImageTitikApi(parentTitikApi);
                                    }
                                    else{
                                        await _downloadVideoTitikApi(parentTitikApi);
                                    }
                                    RealmServices.saveData("TABLE_TITIK_API", tempTitikApi);
                                    RealmServices.saveData("TABLE_SYNC", {
                                        TABLE_NAME: "TABLE_TITIK_API",
                                        LATEST_SYNC: moment().format("YYYYMMDDHHmmss").toString()
                                    })
                                }
                            })
                        );
                    })
                );
            }
            syncStatus = response.status;
        });
    await TMobileSync("titik-api");
    return syncStatus;
}

async function _downloadImageTitikApi(titikApiData){
    let syncStatus = false;
    let isExist = await fetchBlob.fileExist(`${FilePath.pathImage}/${titikApiData.FILE_NAME}`);
    if (!isExist) {
        let downloadImageRequest = {
            imageName: titikApiData.FILE_NAME,
            imageURL: titikApiData.URL,
            imagePathDestination: `${FilePath.pathImage}/${titikApiData.FILE_NAME}`,
            description: "Titik Api",
        };

        await downloadImage(downloadImageRequest.imagePathDestination, downloadImageRequest.imageURL)
            .then((response)=>{
                if(response){
                    let imageData = {
                        ID: downloadImageRequest.imageName.replace(".jpg", ""),
                        RELATION_ID: titikApiData.ID,
                        IMAGE_NAME: downloadImageRequest.imageName,
                        INSERT_TIME: titikApiData.INSERT_TIME,

                        SYNC_STATUS: true,
                        IMAGE_TYPE: "TITIK-API",
                        IMAGE_LOCAL_PATH: downloadImageRequest.imagePathDestination,
                        IMAGE_URL: downloadImageRequest.imageURL
                    };
                    RealmServices.saveData("TABLE_IMAGE",imageData);
                }
            })
    }
    return syncStatus
}

async function _downloadVideoTitikApi(titikApiData){
    let syncStatus = false;
    let isExist = await fetchBlob.fileExist(`${FilePath.pathVideo}/${titikApiData.FILE_NAME}`);
    if (!isExist) {
        let downloadVideoRequest = {
            videoName: titikApiData.FILE_NAME,
            videoURL: titikApiData.URL,
            videoPathDestination: `${FilePath.pathVideo}/${titikApiData.FILE_NAME}`,
            description: "Titik Api",
        };

        await downloadImage(downloadVideoRequest.videoPathDestination, downloadVideoRequest.videoURL)
            .then((response)=>{
                if(response){
                    let videoData = {
                        ID: downloadVideoRequest.videoName.replace(".mp4", ""),
                        RELATION_ID: titikApiData.ID,
                        VIDEO_NAME: downloadVideoRequest.videoName,
                        INSERT_TIME: titikApiData.INSERT_TIME,

                        SYNC_STATUS: true,
                        VIDEO_TYPE: "TITIK-API",
                        VIDEO_LOCAL_PATH: downloadVideoRequest.videoPathDestination,
                        VIDEO_URL: downloadVideoRequest.videoURL
                    };
                    RealmServices.saveData("TABLE_VIDEO",videoData);
                }
            })
    }
    return syncStatus
}

async function TMobileSync(keyword){
    let syncStatus = false;
    let token = RealmServices.getLoginToken();
    let header = {
        Authorization: `Bearer ${token}`
    };
    let request = {
        "TABEL_UPDATE": keyword
    };
    await post("MOBILE-SYNC",request, header)
        .then((response)=>{
            syncStatus = response.status
        });

    return syncStatus;
}

export default {
    uploadTrack,
    uploadTitikApi,
    uploadImage,
    uploadVideo,
    downloadListBA,
    downloadJalurPatroli,
    downloadTitikApi
}