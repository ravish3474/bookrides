const inventoryController = require('../../controllers/inventoryController');
const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/inventory/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.get('/',inventoryController.check);

router.post('/vehicleDocUpdate',upload.any(),inventoryController.vehicleDocUpdate);

router.post('/getVehicleStatus',upload.none(),inventoryController.getVehicleStatus);

router.post('/getAllVehicleList',upload.none(),inventoryController.getAllVehicleList);

router.post('/add_vehicle',upload.any(),inventoryController.add_vehicle);

module.exports = router;