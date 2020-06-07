var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
const app = express();
var util = require("util");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/inventory/')
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
            var check_sql="SELECT * FROM vehicle_list WHERE reg_number='"+formData.reg_number+"'";
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
                        var sql = "INSERT INTO vehicle_list(supplier_id,vehicleBrand,vehicleModel,reg_number,insurance_exp_date,puc_exp_date,documents) VALUES ";
                        sql+= util.format("('%d','%d','%d','%s','%s','%s','%s')",formData.supplier_id,formData.vehicleBrand,formData.vehicleModel,formData.reg_number,formData.insurance_exp_date,formData.puc_exp_date,documents);
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                res.status(200).json({
                                    status:'1',
                                    msg:'Vehicle Added Successfully ! Pending For Approval'
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