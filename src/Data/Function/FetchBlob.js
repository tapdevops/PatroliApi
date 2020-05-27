import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

export async function fileExist(filePath){
    await RNFetchBlob.fs.exists(filePath)
        .then((exist) => {
            return exist
        })
        .catch(() => {
            return false
        })
}

//folder path example "/image"
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

export async function copyFile(SRC_PATH, DEST_PATH){
    let copyStatus = {
        status: false,
        message: null
    };

    //remove existing file
    await fileExist(DEST_PATH)
        .then(async (isExist)=>{
            if(isExist){
                await this.deletePath(DEST_PATH)
            }
        });

    await RNFetchBlob.fs.cp(SRC_PATH, DEST_PATH)
        .then(() => {
            copyStatus = {
                ...copyStatus,
                status: true,
            }
        })
        .catch((err) => {
            copyStatus = {
                ...copyStatus,
                message: err
            }
        });

    return copyStatus;
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

export default {
    fileExist,
    createDirectory,
    deletePath,
    createFileUTF8
}