var db = require('../core/db');

exports.fetch_vehicle_models_by_brand=function(req,res,next){
    const formData = req.body;
    var sql="EXEC fetch_vehicle_models_by_brand @brand_id='"+formData.brand_id+"'";
    db.executeSql(sql,function(data,err){
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
                        msg:'No Models Found'
                    })
                }
            }
    })
};

exports.fetch_vehicle_brands=function(req,res,next){
    db.executeSql("EXEC select_query_all @tbl='vehicle_brands'",function(data,err){
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
};

exports.add_vehicle_model=function(req,res,next){
    var filename = req.file.filename;
    const formData = req.body;
    //console.log('form data', formData);
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var sql="EXEC add_vehicle_model @model_name='"+formData.model_name+"',brand_id='"+formData.brand_id+"'";
            db.executeSql(sql,function(data,err){
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
                        var sql = "EXEC insert_vehicle_model @brand_id='"+formData.brand_id+"', @model_name='"+formData.model_name+"',@model_image='"+filename+"'";
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

};

exports.add_vehicle_brand=function(req,res,next){
    const formData = req.body;
    try{
        if(!formData) throw new Error("Input Not valid");
        // //var data = JSON.parse(reqBody);
        if(formData){
            var check_sql="EXEC fetch_vehicle_by_brand @brand_name='"+formData.brand_name+"'";
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
                        var sql = "EXEC insert_vehicle_brand @brand_name='"+formData.brand_name+"'";
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
};
