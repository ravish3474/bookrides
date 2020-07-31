var db = require("../../core/db");
const smsClient = require("../../controllers/smsClient");
var suppliersController = require('../../controllers/suppliersController');
const express = require('express');
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

router.post('/add_supplier',upload.single('photo'),suppliersController.add_supplier);

router.post('/login_supplier',upload.none(),suppliersController.login_supplier);

// router.get('/:productId', (req, res, next)=>{
//     const id = req.params.productId;
//     if(id === 'special'){
//         res.status(200).json({
//             message:'You discovered the special id',
//             id:id
//         })
//     }
//     else{
//         res.status(200).json({
//             message:'You Passed AN ID'
//         });
//     }
// });

module.exports = router;