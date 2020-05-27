import messaging from '@react-native-firebase/messaging';

import {put} from '../../Data/API/FetchAxios';
import RealmServices from '../../Data/Realm/RealmServices';

async function notificationCloseListener(){
    let fcmData = null;
    await messaging().getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage && remoteMessage) {
                fcmData = remoteMessage.data
            }
        });

    return fcmData;
}

async function notificationBackgroundListener(){
    let fcmData = null;
    await messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage && remoteMessage) {
            fcmData = remoteMessage.data
        }
    });
    return fcmData;
}

async function updateTokenFCM(){
    let fcmToken = await messaging().getToken();
    let loginToken = RealmServices.getLoginToken();

    if(fcmToken && loginToken){
        let header = {
            "Authorization": `Bearer ${loginToken}`
        };

        let request = {
            "FIREBASE_TOKEN": `${fcmToken}`
        };

        return await put("UPDATE-FIREBASE-TOKEN", request, header)
            .then((response)=>{
                return response.status
            });
    }
}

export default {
    updateTokenFCM,
    notificationCloseListener,
    notificationBackgroundListener
}