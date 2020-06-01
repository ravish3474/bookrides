var db = require("../core/db");
var express = require('express');
const app = express();
var httpMsgs = require("../core/httpMsgs");
var util = require("util");
var fileupload = require('express-fileupload');
app.use(fileupload());
exports.getList = function (req,resp){
    db.executeSql("SELECT * FROM Dept",function(data,err){
        if(err){
            httpMsgs.show500(req,resp,err);
        }
        else{
            httpMsgs.sendJson(req,resp,data);
        }
        resp.end();
    })
};

exports.get = function (req,resp,empno){
    db.executeSql("SELECT * FROM Dept WHERE dept_1=" + empno,function(data,err){
        if(err){
            httpMsgs.show500(req,resp,err);
        }
        else{
            httpMsgs.sendJson(req,resp,data);
        }
        resp.end();
    })
};

exports.add = function (req,resp,reqBody){
    try{
        if(!reqBody) throw new Error("Input Not valid");
        //var data = JSON.parse(reqBody);
        console.log(reqBody);
        if(data){
            var sql = "INSERT INTO Dept(dept_1,dept_2) VALUES ";
            sql+= util.format("('%s','%s')",data.dept_1,data.dept_2);
            db.executeSql(sql,function(data,err){
                if(err){
                    httpMsgs.show500(req,resp,err);
                }else{
                    httpMsgs.send200(req,resp,data);
                }
            })
        }
    }
    catch(ex){
        httpMsgs.show500(req, resp, ex);
    }
};

exports.update = function (req,resp,reqBody){

};

exports.delete = function (req,resp,reqBody){

};