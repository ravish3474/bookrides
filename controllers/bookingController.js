var db = require('../core/db');
var moment = require('moment');
var sqlDb = require('mssql');

exports.check_availability=function(req,res,next){
    const formData = req.body;
    var start_date = formData.start_date;
    var end_Date = formData.end_date;
    var location_id = formData.location_id;
    start_date= moment(start_date, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD");
    end_Date = moment(end_Date, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD");
    let sqlParams = [
        { "name": "start", "type": sqlDb.DateTime, "value":start_date },
        { "name": "final_date", "type": sqlDb.DateTime, "value":end_Date },
        { "name": "location_id", "type": sqlDb.VarChar, "value":location_id }
    ];
    db.callProcedure(sqlParams, 'check_vehicle_availability',function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
            if(data.recordsets[2].length==0){
                res.status(200).json({
                    status:'0',
                    msg:'No Vehicles Found On These Dates'
                })
            }else{
                res.status(200).json({
                    status:'1',
                    msg:data.recordsets[2],
                })
            }
            }
    })
}

exports.fetchSuppliersByModel=function(req,res,next){
    const formData = req.body;
    var start_date = formData.start_date;
    var end_Date = formData.end_date;
    var location_id = formData.location_id;
    var vehicle_model = formData.vehicle_model;
    start_date= moment(start_date, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD");
    end_Date = moment(end_Date, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD");
    let sqlParams = [
        { "name": "start", "type": sqlDb.DateTime, "value":start_date },
        { "name": "final_date", "type": sqlDb.DateTime, "value":end_Date },
        { "name": "location_id", "type": sqlDb.VarChar, "value":location_id},
        { "name": "vehicle_model", "type": sqlDb.VarChar, "value":vehicle_model}
    ];
    db.callProcedure(sqlParams, 'fetch_supplier_by_model',function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
            if(data.recordsets[0].length==0){
                res.status(200).json({
                    status:'0',
                    msg:'No Vehicles Found On These Dates'
                })
            }else{
                res.status(200).json({
                    status:'1',
                    msg:data.recordsets[0],
                })
            }
            }
    })
}



