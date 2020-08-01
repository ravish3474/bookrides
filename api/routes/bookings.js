const bookingController = require('../../controllers/bookingController');
const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage });

router.post('/checkAvailability',upload.none(),bookingController.check_availability);
router.post('/fetchSuppliersByModel',upload.none(),bookingController.fetchSuppliersByModel);

module.exports = router;