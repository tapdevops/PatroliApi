import RNFetchBlob from 'rn-fetch-blob';

//     DocumentDir: '/data/user/0/com.patroliapi/files',
//     CacheDir: '/data/user/0/com.patroliapi/cache',
//     PictureDir: '/storage/emulated/0/Pictures',
//     MusicDir: '/storage/emulated/0/Music',
//     MovieDir: '/storage/emulated/0/Movies',
//     DownloadDir: '/storage/emulated/0/Download',
//     DCIMDir: '/storage/emulated/0/DCIM',
//     SDCardDir: '/storage/emulated/0',
//     SDCardApplicationDir: '/storage/emulated/0/Android/data/com.patroliapi',
//     MainBundleDir: '/data/user/0/com.patroliapi',
//     LibraryDir: undefined
export const pathDir =  RNFetchBlob.fs.dirs;

//folder directory
export const directoryPatroli = pathDir.SDCardApplicationDir+"/Patroli";
export const pathDatabase = directoryPatroli+"/Database";
export const pathZip = directoryPatroli+"/pathZip";
