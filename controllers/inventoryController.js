var db = require("../core/db");

exports.check=function(req,res,next){
    res.status(200).json({
        message:'Handling Get Request to /inventory'
    });
};

exports.vehicleDocUpdate=function(req,res,next){
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
};

exports.getVehicleStatus=function(req,res,next){
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
};

exports.getAllVehicleList=function(req,res,next){
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
};

exports.add_vehicle=function(req,res,next){
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

};