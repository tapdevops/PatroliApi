import Realm from 'realm';

const SCHEMA_VERSION = 1;

export const TABLE_SESSION = {
    name: 'TABLE_SESSION',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        NAME: {type: 'string', optional: false},
        INSERT_TIME: {type: 'double', optional: false}
    }
};

export const TABLE_COORDINATE = {
    name: 'TABLE_COORDINATE',
    primaryKey: 'ID',
    properties: {
        ID: {type: 'string', optional: false},
        ID_SESSION: {type: 'string', optional: false},
        LONGITUDE: {type: 'string', optional: false},
        LATITUDE: {type: 'string', optional: false},
        INSERT_TIME: {type: 'double', optional: false},
        FIRE_STATUS: {type: 'string', optional: false}
    }
};

let RealmSchema = new Realm({
    schema: [
        TABLE_SESSION,
        TABLE_COORDINATE
    ],
    schemaVersion: SCHEMA_VERSION
});

export default RealmSchema
