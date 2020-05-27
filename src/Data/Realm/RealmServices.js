import RealmSchemas from './RealmSchema'

const TaskServices = {

  getPath: function () {
    return RealmSchemas.path;
  },

  saveData: async function (table, obj) {
    try {
      await RealmSchemas.write(() => {
        RealmSchemas.create(table, obj, 'all');
      })
    } catch (error) {
      console.log(error)
    }
  },

  getLogin: function (){
    return RealmSchemas.objects("TABLE_LOGIN")[0];
  },

  getLoginToken: function(){
    let loginToken = RealmSchemas.objects("TABLE_LOGIN")[0];
    if(loginToken && loginToken.ACCESS_TOKEN){
      return loginToken.ACCESS_TOKEN
    }
    return null
  },

  getAllData: function (table) {
    return RealmSchemas.objects(table);
  },

  getTotalData: function (table) {
    return RealmSchemas.objects(table).length;
  },

  findBySingle: function (table, param, value) {
    let list = RealmSchemas.objects(table);
    return list.filtered(param + ' == \"' + value + '\" ')[0];
  },

  findBy: function (table, param, value) {
    let list = RealmSchemas.objects(table);
    return list.filtered(param + ' == \"' + value + '\" ');
  },

  findByNonString: function (table, param, value) {
    let list = RealmSchemas.objects(table);
    return list.filtered(param + ' == ' + value);
  },

  findFistIndex: function(table){
    return RealmSchemas.objects(table)[0];
  },

  query: function (table, query) {
    let list = RealmSchemas.objects(table);
    return list.filtered(query);
  },

  deleteAllData: function (table) {
    RealmSchemas.write(() => {
      let data = RealmSchemas.objects(table);
      RealmSchemas.delete(data);
    })
  },

  deleteRecord: function (table, index) {
    RealmSchemas.write(() => {
      RealmSchemas.delete(RealmSchemas.objects(table)[index]);
    });
  },

  deleteRecordByPrimayKey: function (table, PK_NAME, primary_key) {
    let result = RealmSchemas.objects(table).find(row => {
      return row[PK_NAME] == primary_key
    })
    if (result) {
      RealmSchemas.write(() => {
        RealmSchemas.delete(result);
      });
    }
  },

  updateByPrimaryKey: function (table, param) {
    RealmSchemas.write(() => {
      RealmSchemas.create(table, param, 'modified')
    });
  },
};

export default TaskServices;
