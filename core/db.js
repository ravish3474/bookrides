var sqlDb = require('mssql');
var settings = require('../settings');

exports.callProcedure=function(sqlParams, SpName,callback){
    var conn = new sqlDb.ConnectionPool(settings.dbConfig);
        conn.connect().
        then(function(){
            var req = new sqlDb.Request(conn);
            sqlParams.forEach(function (param) {
                req.input(param.name, param.type, param.value);
            });
            req.execute(SpName).then(function(recordsets, err, returnValue, affected) {
                callback(recordsets);
                // console.dir(recordset);
                // console.dir(err);
              }).catch(function(err) {
                console.log(err);
              });
        })
        .catch(function(err){
            console.log(err);
            callback(null,err);
        });
}

exports.executeSql = function (sql,callback){
    var conn = new sqlDb.ConnectionPool(settings.dbConfig);
    conn.connect().
    then(function(){
        var req = new sqlDb.Request(conn);
        req.query(sql).then(function(recordset){
            callback(recordset);
        }).catch(function(err){
            console.log(err);
            callback(null,err);
        });
    })
    .catch(function(err){
        console.log(err);
        callback(null,err);
    });
};