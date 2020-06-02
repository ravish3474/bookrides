var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
const app = express();
var util = require("util");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/vehicles/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Handling Get Request to /vehicles'
    });
});

router.post('/fetch_vehicle_models_by_brand',upload.none(), (req, res, next)=>{
    const formData = req.body;
    db.executeSql("SELECT * FROM vehicle_models WHERE brand_id=" + formData.brand_id,function(data,err){
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
                        msg:data.recordsets,
                    })
                }
                else{
                    res.status(500).json({
                        status:'0',
                        msg:'No Models Found'
                    })
                }
            }
    })
});

router.get('/fetch_vehicle_brands', (req, res, next)=>{
    db.executeSql("SELECT * FROM vehicle_brands",function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
            res.status(200).json({
                status:'1',
                msg:data.recordsets,
            })
            }
    })
});

router.post('/add_vehicle_model',upload.single('photo'), (req, res, next)=>{
    var filename = req.file.filename;
    const formData = req.body;
    //console.log('form data', formData);
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            db.executeSql("SELECT * FROM vehicle_models WHERE model_name='"+formData.model_name+"' AND brand_id="+formData.brand_id,function(data,err){
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
                            msg:'Model Already Exists for the given brand'
                        })
                    }
                    else{
                        var sql = "INSERT INTO vehicle_models(brand_id,model_name,model_image) VALUES ";
                        sql+= util.format("('%d','%s','%s')",formData.brand_id,formData.model_name,filename);
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                res.status(200).json({
                                    status:'1',
                                    msg:'Model Added Successfully'
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

router.post('/add_vehicle_brand',upload.none(),(req, res, next)=>{
    const formData = req.body;
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var check_sql="SELECT * FROM vehicle_brands WHERE brand_name='"+formData.brand_name+"'";
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
                            msg:'Brand Already Registered'
                        })
                    }
                    else{
                        var sql = "INSERT INTO vehicle_brands(brand_name) VALUES ";
                        sql+= util.format("('%s')",formData.brand_name);
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                res.status(200).json({
                                    status:'1',
                                    msg:'Brand Added Successfully'
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