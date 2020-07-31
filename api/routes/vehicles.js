var vehiclesController = require('../../controllers/vehiclesController');
const express = require('express');
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/vehicles/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.post('/fetch_vehicle_models_by_brand',upload.none(),vehiclesController.fetch_vehicle_models_by_brand);

router.get('/fetch_vehicle_brands',vehiclesController.fetch_vehicle_brands);

router.post('/add_vehicle_model',upload.single('photo'),vehiclesController.add_vehicle_model);

router.post('/add_vehicle_brand',upload.none(),vehiclesController.add_vehicle_brand);

module.exports = router;