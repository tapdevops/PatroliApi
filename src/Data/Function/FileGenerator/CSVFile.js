import RealmServices from '../../Realm/RealmServices';
import {createFileUTF8} from "../FetchBlob";

export async function generateCSVFile(filePath, fileData){
    let status = false;
    await createFileUTF8(filePath, fileData)
        .then((response)=>{
            if(response.status){
                status = true;
            }
        })
        .catch((e)=>{
            console.log("generate csv error:",e);
            status = false;
        });

    return status
}

export function patroliToCsvFormat(sessionID){
    let headerString = ["ID", "ID_SESSION", "LONGITUDE", "LATITUDE", "INSERT_TIME", "FIRE_STATUS"].join()+ "\n";
    let bodyString = null;

    let getPatroli = RealmServices.findBy("TABLE_COORDINATE", "ID_SESSION", sessionID).sorted("INSERT_TIME", true);
    if(getPatroli !== undefined){
        getPatroli.map((patroliModel)=>{
            let patroliCSVData = [patroliModel.ID.toString(), patroliModel.ID_SESSION.toString(), patroliModel.LONGITUDE.toString(), patroliModel.LATITUDE.toString(), patroliModel.INSERT_TIME.toString(), patroliModel.FIRE_STATUS.toString()].join()+ "\n";
            if(bodyString === null){
                bodyString = patroliCSVData;
            }
            else {
                bodyString = bodyString + patroliCSVData;
            }
        });
        return headerString + bodyString;
    }
    return null;
}
