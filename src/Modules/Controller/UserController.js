import RealmServices from "../../Data/Realm/RealmServices";

function getUserData(){
    return RealmServices.getLogin();
}

function getUserToken(){
    return RealmServices.getLoginToken();
}

function isUserAuthorized(){
    let userData = RealmServices.getLogin();
    return userData.AUTHORIZED === "YES";
}

export default {
    getUserData,
    getUserToken,
    isUserAuthorized
}