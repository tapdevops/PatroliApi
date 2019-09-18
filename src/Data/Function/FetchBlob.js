import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// (pathDir.DocumentDir)
// (pathDir.CacheDir)
// (pathDir.DCIMDir)
// (pathDir.DownloadDir)
export const pathDir =  RNFetchBlob.fs.dirs;
const fs = RNFetchBlob.fs;


//folder path example "/image/image.png"
export async function createDirectory(folderPath){
    let responseStatus = {
        status: false,
        message: null
    };

    await RNFetchBlob.fs.mkdir(pathDir.DocumentDir+folderPath)
        .then((response)=>{
            if(response){
                responseStatus = {
                    status: true,
                    message: "File created!"
                }
            }
        })
        .catch((e)=>{
            responseStatus = {
                status: false,
                message: "Make directory failed : " + JSON.stringify(e)
            }
        });

    return responseStatus
}

//folder path example "/image/image.png"
export async function deletePath(folderPath){
    let responseStatus = {
        status: false,
        message: null
    };

    await RNFetchBlob.fs.unlink(folderPath)
        .then(() => {
            responseStatus = {
                status: true,
                message: "File deleted!"
            }
        })
        .catch((e) => {
            responseStatus = {
                status: false,
                message: "Delete directory failed : " + JSON.stringify(e)
            }
        });

    return responseStatus
}

export async function createFileUTF8(filePath, fileData){
    let responseStatus = {
        status: false,
        message: null
    };
    let finalFilePath = pathDir.DocumentDir + filePath;

    await RNFetchBlob.fs.writeFile(finalFilePath, fileData, 'utf8')
        .then(() => {
            responseStatus = {
                status: true,
                message: "File Created!"
            }
        })
        .catch((e) => {
            responseStatus = {
                status: false,
                message: "Create File failed : " + JSON.stringify(e)
            }
        });

    return responseStatus
}
