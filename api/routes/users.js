var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
const express = require('express');
var util = require("util");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/users/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Handling Get Request to /users'
    });
});

router.post('/update-profile',upload.none(),(req, res, next)=>{
    const formData = req.body;
    const first_name = formData.first_name;
    const last_name = formData.last_name;
    const email = formData.email;
    const user_id = formData.user_id;
    var checksql="EXEC check_user @email='"+email+"'";
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
            msg:'Email Already Exists'
        })
    }
    else{
    var sql="EXEC update_user @first_name='"+first_name+"', @last_name='"+last_name+"',@email='"+email+"',@user_id='"+user_id+"'";
    db.executeSql(sql,function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:'Error Occured'
            })
        }else{
            var nsql="EXEC check_user_by_id @user_id='"+user_id+"'";
            db.executeSql(nsql,function(data,err){
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
                                msg:err
                            })
                        }
                    }
            })
        }
    })
    }
}
    })
});

router.post('/login',upload.none(),(req, res, next)=>{
    const formData = req.body;
    var mobile = formData.mobile_number;
    var otp = Math.floor(Math.random() * (999999 - 111111)) + 111111;
    var nsql="EXEC login_mobile @mobile='"+mobile+"'";
    db.executeSql(nsql,function(data,err){
        if(err){
            res.status(500).json({
                status:'0',
                msg:err
            })
        }
        else{
                if(data.rowsAffected[0]!=0){
                    //var otp = Math.floor(Math.random() * (999999 - 111111)) + 111111;
                    const user = {otp: otp, phone: mobile};
                    smsClient.sendUserWelcomeMessage(user);
                    res.status(200).json({
                        status:'1',
                        msg:data.recordsets[0],
                        otp:otp,
                        new_user:'0'
                    })
                }
                else{
                    var sql = "EXEC create_user @mobile='"+mobile+"'";
                    db.executeSql(sql,function(data,err){
                        if(err){
                            res.status(500).json({
                                status:'0',
                                msg:'Error Occured'
                            })
                        }else{
                            const user = {otp: otp, phone: mobile};
                            smsClient.sendUserWelcomeMessage(user);
                            res.status(200).json({
                                status:'1',
                                msg:data.recordsets[0],
                                otp:otp,
                                new_user:'1',
                                user_id:data.ID
                            })
                        }
                    })
                }
            }
    })
});

module.exports = router;