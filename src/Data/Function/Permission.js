import {PermissionsAndroid} from 'react-native';

export async function getPermission() {
    try {
        // const phone = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        //     {
        //         'title': 'PatroliApi wants to READ_PHONE_STATE',
        //         'message': 'PatroliApi App needs access to your personal data. '
        //     }
        // );
        // const camera = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.CAMERA,
        //     {
        //         'title': 'PatroliApi wants to CAMERA',
        //         'message': 'PatroliApi App needs access to your personal data. '
        //     }
        // );
        const storage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': 'PatroliApi wants to READ_EXTERNAL_STORAGE',
                'message': 'PatroliApi App needs access to your personal data. '
            }
        );
        const location = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'PatroliApi wants to ACCESS_FINE_LOCATION',
                'message': 'PatroliApi App needs access to your personal data. '
            }
        );
        const storageWrite =  await PermissionsAndroid.request(
        	PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE ,
        	{
        	  'title': 'PatroliApi wants to WRITE_EXTERNAL_STORAGE',
        	  'message': 'PatroliApi App needs access to your personal data. '
        	}
        );
        return (
            // phone === PermissionsAndroid.RESULTS.GRANTED &&
            // camera === PermissionsAndroid.RESULTS.GRANTED &&
            storage === PermissionsAndroid.RESULTS.GRANTED &&
            location === PermissionsAndroid.RESULTS.GRANTED&&
            storageWrite === PermissionsAndroid.RESULTS.GRANTED
        );

    } catch (e) {
        return false;
    }
}
