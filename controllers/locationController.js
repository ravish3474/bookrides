var db = require("../core/db");
var sqlDb = require('mssql');

exports.fetch_locations=function(req,res,next){
    let sqlParams = [{ "name": "tbl", "type": sqlDb.VarChar, "value":"location_master" }];
    db.callProcedure(sqlParams, 'select_query_all',function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
            res.status(200).json({
                status:'1',
                msg:data.recordset,
            })
            }
    })
};

exports.add_location=function(req,res,next){
    const formData = req.body;
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            let sqlParams = [{ "name": "location_name", "type": sqlDb.VarChar, "value":formData.location_name }];
            db.callProcedure(sqlParams, 'check_location',function(data,err){
                if(err){
                    res.status(500).json({
                        status:'0',
                        msg:err
                    })
                }
                else{
                    if(data.rowsAffected[0]!=0){
                        res.status(500).json({
                            status:'0',
                            msg:'Location Already Exists'
                        })
                    }
                    else{
                        var sql = "EXEC insert_location @location_name='"+formData.location_name+"'";
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                res.status(200).json({
                                    status:'1',
                                    msg:'Location Added Successfully'
                                })
                            }
                        })
                    }
                }
            })
        }
    }
    catch(ex){
        res.status(500).json({
            status:'0',
            msg:'Error Occured'
        })
    }

};