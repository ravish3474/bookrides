var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
const app = express();
var util = require("util");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/suppliers/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

//app.use(morgan('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
//app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Handling Get Request to /products'
    });
});

router.post('/add_supplier',upload.single('photo'), (req, res, next)=>{
    //console.log('form data', formData);
    var filename = req.file.filename;
    const formData = req.body;
    console.log('form data', formData);
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var checksql="EXEC check_supplier @email = '"+formData.email+"', @mobile_number = '"+formData.mobile_number+"'";
            db.executeSql(checksql,function(data,err){
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
                            msg:'Supplier With Same Mobile Or Email Already Exists'
                        })
                    }
                    else{
                        var sql="EXEC add_supplier @first_name = '"+formData.first_name+"', @last_name = '"+formData.last_name+"',@email='"+formData.email+"',@company_name='"+formData.company_name+"',@gst_number='"+formData.gst_number+"',@mobile_number='"+formData.mobile_number+"',@photo='"+formData.filename+"',@address='"+formData.address+"',@location_id='"+formData.location_id+"',@latitude='"+formData.latitude+"',@longitude='"+formData.longitude+"',@opening_time='"+formData.opening_time+"',@closing_time='"+formData.closing_time+"'";
                        db.executeSql(sql,function(data,err){
                            if(err){
                                res.status(500).json({
                                    status:'0',
                                    msg:'Error Occured'
                                })
                            }else{
                                res.status(200).json({
                                    status:'1',
                                    msg:'Supplier Added Successfully'
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

router.post('/login_supplier',upload.none(), (req, res, next)=>{
    const formData = req.body;
    var mobile = formData.mobile_number;
    var nsql = "exec login_supplier @mobile='"+mobile+"'";
    db.executeSql(nsql,function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
                    if(data.rowsAffected[0]!=0){
                    var otp = Math.floor(Math.random() * (999999 - 111111)) + 111111;
                    const user = {otp: otp, phone: mobile};
                    smsClient.sendPartnerWelcomeMessage(user);
                    res.status(200).json({
                        status:'1',
                        msg:data.recordsets[0],
                        otp:otp
                    })
                }
                else{
                    res.status(500).json({
                        status:'0',
                        msg:'No Supplier Found'
                    })
                }
            }
    })
});

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message:'You discovered the special id',
            id:id
        })
    }
    else{
        res.status(200).json({
            message:'You Passed AN ID'
        });
    }
});

module.exports = router;