import Realm from 'realm';

const SCHEMA_VERSION = 1;

export const TABLE_SERVICELIST = {
    name: 'TABLE_SERVICELIST',
    properties: {
        "MOBILE_VERSION": {type: 'string', optional: false},
        "API_NAME": {type: 'string', optional: false},
        "KETERANGAN": {type: 'string', optional: true},
        "METHOD": {type: 'string', optional: false},
        "API_URL": {type: 'string', optional: false}
    }
};

export const TABLE_LOGIN = {
    name: 'TABLE_LOGIN',
    properties: {
        "EMPLOYEE_NIK": {type: 'string', optional: true},
        "EMPLOYEE_USERNAME": {type: 'string', optional: true},
        "EMPLOYEE_FULLNAME": {type: 'string', optional: true},
        "EMPLOYEE_EMAIL": {type: 'string', optional: true},
        "EMPLOYEE_POSITION": {type: 'string', optional: true},
        "ADMIN": {type: 'string', optional: true},
        "AUTHORIZED": {type: 'string', optional: true},
        "ACCESS_TOKEN": {type: 'string', optional: true},
    }
};

export const TABLE_SYNC = {
    name: 'TABLE_SYNC',
    primaryKey: 'TABLE_NAME',
    properties: {
        "TABLE_NAME": {type: 'string', optional: false},
        "LATEST_SYNC": {type: 'string', optional: true, default :"0"}
    }
};

export const TABLE_BA = {
    name: 'TABLE_BA',
    primaryKey: 'WERKS',
    properties: {
        "EST_NAME": {type: 'string', optional: false},
        "WERKS": {type: 'string', optional: false},
        //LOCAL
        "ACTIVE": {type: 'bool', optional: true}
    }
};

export const TABLE_ROUTE={
    name: 'TABLE_ROUTE',
    properties: {
        LATITUDE: {type: 'double', optional: false},
        LONGITUDE: {type: 'double', optional: false},
        WERKS: {type: 'string', optional: false},
        JALUR: {type: 'string', optional: false},

        //LOCAL VARIABLE
        INDEX: {type: 'double', optional: false}
    }
};

export const TABLE_SESSION = {
    name: 'TABLE_SESSION',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        NAME: {type: 'string', optional: false},
        JALUR: {type: 'string', optional: false},
        WERKS: {type: 'string', optional: false},
        DURASI: {type: 'string', optional: false},
        JARAK: {type: 'string', optional: false},
        INSERT_TIME: {type: 'string', optional: false},

        //local
        CHECKPOINT: {type: 'string', optional: true, default: "0/0"},
        TRACK_SYNC : {type: 'bool', optional: true, default: false},
    }
};

export const TABLE_TRACK = {
    name: 'TABLE_TRACK',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        ID_SESSION: {type: 'string', optional: false},
        LONGITUDE: {type: 'double', optional: false},
        LATITUDE: {type: 'double', optional: false},
        INSERT_TIME: {type: 'string', optional: false}
    }
};

export const TABLE_TITIK_API = {
    name: 'TABLE_TITIK_API',
    primaryKey: `UNIQUE_TAG`,
    properties: {
        ID: {type: 'string', optional: false},
        ID_SESSION: {type: 'string', optional: false},
        BA_CODE: {type: 'string', optional: false},
        LONGITUDE: {type: 'double', optional: false},
        LATITUDE: {type: 'double', optional: false},
        DATE: {type: 'string', optional: false},
        INSERT_TIME: {type: 'string', optional: false},
        LUAS_AREA: {type: 'string', optional: true},
        LOKASI: {type: 'string', optional: false},
        KETERANGAN: {type: 'string', optional: true},
        STATUS_TITIK_API: {type: 'string', optional: true, default: "BELUM PADAM"},
        LAPOR_PIHAK_BERWAJIB: {type: 'string', optional: true, default: "NO"},

        //local param
        UNIQUE_TAG: {type: 'string', optional: false},
        SYNC_STATUS: {type: 'bool', optional: true, default: false},
        EMPLOYEE_FULLNAME: {type: 'string', optional: true},
        INSERT_USER: {type: 'string', optional: true}
    }
}

export const TABLE_IMAGE = {
    name: 'TABLE_IMAGE',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        RELATION_ID: {type: 'string', optional: false},
        IMAGE_NAME: {type: 'string', optional: false},
        INSERT_TIME: {type: 'string', optional: false},

        SYNC_STATUS: {type: 'bool', optional: true, default: false},
        IMAGE_TYPE: {type: 'string', optional: true},
        IMAGE_LOCAL_PATH: {type: 'string', optional: true},
        IMAGE_URL: {type: 'string', optional: true}
    }
};

export const TABLE_VIDEO = {
    name: 'TABLE_VIDEO',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        RELATION_ID: {type: 'string', optional: false},
        VIDEO_NAME: {type: 'string', optional: false},
        INSERT_TIME: {type: 'string', optional: false},

        SYNC_STATUS: {type: 'bool', optional: true, default: false},
        VIDEO_TYPE: {type: 'string', optional: false},
        VIDEO_LOCAL_PATH: {type: 'string', optional: true},
        VIDEO_URL: {type: 'string', optional: true}
    }
};

let RealmSchema = new Realm({
    schema: [
        TABLE_SERVICELIST,
        TABLE_LOGIN,
        TABLE_SYNC,
        TABLE_BA,
        TABLE_ROUTE,
        TABLE_SESSION,
        TABLE_TRACK,
        TABLE_TITIK_API,
        TABLE_IMAGE,
        TABLE_VIDEO
    ],
    schemaVersion: SCHEMA_VERSION
});

export default RealmSchema
