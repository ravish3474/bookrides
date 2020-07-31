var db = require("../core/db");
const smsClient = require("./smsClient");

exports.add_supplier=function(req,res,next){
    var filename = req.file.filename;
    const formData = req.body;
    try{
        if(!formData) throw new Error("Input Not valid");
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
                        var sql="EXEC add_supplier @first_name = '"+formData.first_name+"', @last_name = '"+formData.last_name+"',@email='"+formData.email+"',@company_name='"+formData.company_name+"',@gst_number='"+formData.gst_number+"',@mobile_number='"+formData.mobile_number+"',@photo='"+formData.filename+"',@address='"+formData.address+"',@location_id='"+formData.location_id+"',@latitude='"+formData.latitude+"',@longitude='"+formData.longitude+"',@opening_time='"+formData.opening_time+"',@closing_time='"+formData.closing_time+"',@advance_days='"+formData.advance_days+"'";
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
};

exports.login_supplier=function(req,res,next){
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
};