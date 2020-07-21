var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
const app = express();
var util = require("util");
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/inventory/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Handling Get Request to /inventory'
    });
});

router.post('/vehicleDocUpdate',upload.any(), (req, res, next)=>{
    var filename = req.files;
    const formData = req.body;
    var vehicle_id = formData.vehicle_id;
    filename.forEach(element => {
        var sql = "EXEC vehicleDocumentsUpdate @vehicle_id='"+vehicle_id+"',@document_photo='"+element.filename+"'";
        db.executeSql(sql,function(data,err){});
    });
    res.status(200).json({
        status:'1',
        msg:'Documents Uploaded'
    })
})

router.post('/getVehicleStatus',upload.none(),(req, res, next)=>{
    const formData = req.body;
    var check_sql="EXEC getVehicleStatus @reg_num = '"+formData.reg_num+"'";
    db.executeSql(check_sql,function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
                if(data.rowsAffected[0]!=0){
                    var whole_data = data.recordsets[0];
                    var vehicle_id= whole_data[0].vehicle_id;
                    var check_sql="EXEC vehicleDocuments @vehicle_id='"+vehicle_id+"'";
                    db.executeSql(check_sql,function(data,err){
                    if(!err){
                        res.status(200).json({
                            status:'1',
                            msg:whole_data,
                            docs:data.recordsets[0]
                        })
                    }
                })
                }
                else{
                    res.status(500).json({
                        status:'0',
                        msg:'Registration number not found'
                    })
                }
            }
    })
});

router.post('/getAllVehicleList',upload.none(),(req, res, next)=>{
    const formData = req.body;
    var check_sql="EXEC getAllVehicleList @supplier_id='"+formData.supplier_id+"'";
    db.executeSql(check_sql,function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
                if(data.rowsAffected[0]!=0){
                    res.status(200).json({
                        status:'1',
                        msg:data.recordsets[0],
                    })
                }
                else{
                    res.status(500).json({
                        status:'0',
                        msg:'Supplier not found'
                    })
                }
            }
    })
});

router.post('/add_vehicle',upload.any(), (req, res, next)=>{
    var filename = req.files;
    const formData = req.body;
    var images = [];
    filename.forEach(element => {
        images.push(element.filename);
    });
    documents=images.toString();
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var check_sql="EXEC check_vehicle @reg_number='"+formData.reg_number+"'";
            db.executeSql(check_sql,function(data,err){
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
                            msg:'Vehicle with same registration number already exists'
                        })
                    }
                    else{
                        var sql = "EXEC add_vehicle @supplier_id='"+formData.supplier_id+"', @vehicleBrand='"+formData.vehicleBrand+"', @vehicleModel='"+formData.vehicleModel+"', @reg_number='"+formData.reg_number+"', @insurance_exp_date='"+formData.insurance_exp_date+"', @puc_exp_date='"+formData.puc_exp_date+"'";
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                var last_id = data.recordsets[0][0].ID;
                                filename.forEach(element => {
                                    var sql = "EXEC vehicleDocumentsUpdate @vehicle_id='"+last_id+"',@document_photo='"+element.filename+"'";
                                    db.executeSql(sql,function(data,err){});
                                });
                                res.status(200).json({
                                    status:'1',
                                    msg:'Vehicle Added Successfully ! Pending For Approval',
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

});

module.exports = router;