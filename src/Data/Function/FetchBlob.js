import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

//folder path example "/image/image.png"
export async function createDirectory(folderPath){
    let responseStatus = {
        status: false,
        message: null
    };

    await RNFetchBlob.fs.mkdir(folderPath)
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

    await RNFetchBlob.fs.writeFile(filePath, fileData, 'utf8')
        .then((result) => {
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
