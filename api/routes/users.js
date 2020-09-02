const userController=require("../../controllers/userController");
const express = require('express');
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

router.get('/',userController.check);

router.post('/update-profile',upload.none(),userController.updateProfile);

router.post('/fetch-profile',upload.none(),userController.userProfile)

router.post('/login',upload.none(),userController.userLogin);

module.exports = router;