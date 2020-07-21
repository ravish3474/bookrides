var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
const app = express();
var util = require("util");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
  var upload = multer({ storage: storage });

  router.get('/fetch_locations', (req, res, next)=>{
    db.executeSql("EXEC select_query_all @tbl='location_master'",function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
            res.status(200).json({
                status:'1',
                msg:data.recordsets[0],
            })
            }
    })
});

  router.post('/add_location',upload.none(),(req, res, next)=>{
    const formData = req.body;
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var check_sql="EXEC check_location @location_name='"+formData.location_name+"'";
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

});

module.exports = router;