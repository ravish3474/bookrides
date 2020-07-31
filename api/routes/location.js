var db = require("../../core/db");
var locationController = require('../../controllers/locationController');
const express = require('express');
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

  router.get('/fetch_locations',locationController.fetch_locations);

  router.post('/add_location',upload.none(),locationController.add_location);

module.exports = router;