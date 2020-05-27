import RealmServices from '../../Data/Realm/RealmServices';

function getAllBA(){
    let listBA = RealmServices.getAllData("TABLE_BA");
    return Array.from(listBA);
}

//get all data from TABLE_BA
function getActiveBA(){
    let activeBA = RealmServices.findByNonString("TABLE_BA", "ACTIVE", true);
    return Array.from(activeBA);
}

//returns only array containing BA_CODE
function getActiveBACodeOnly(){
    let activeBA = RealmServices.findByNonString("TABLE_BA", "ACTIVE", true);
    let tempBA = [];
    for(let counter = 0; counter < activeBA.length; counter ++){
        tempBA.push(activeBA[counter].WERKS);
    }
    return tempBA;
}

function deactivateBA(BA_CODE){
    let status = false;
    let getBA = RealmServices.findBySingle("TABLE_BA", "WERKS", BA_CODE);
    if(getBA && getBA.ACTIVE){
        status = true;
        RealmServices.updateByPrimaryKey("TABLE_BA",{"WERKS": BA_CODE, "ACTIVE": false})
    }
    return status;
}

export default {
    getAllBA,
    getActiveBA,
    getActiveBACodeOnly,
    deactivateBA
}