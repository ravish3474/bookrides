const express = require('express');
const app = express();
var emp = require("../controllers/employee");
var settings = require("../settings");
var httpMsgs = require("./httpMsgs");
const morgan = require('morgan');
const supplierRoutes = require('../api/routes/suppliers');
const vehicleRoutes = require('../api/routes/vehicles');
const locationRoutes = require('../api/routes/location');
const inventoryRoutes = require('../api/routes/inventory');
const userRoutes = require('../api/routes/users');
const bookingRoutes = require('../api/routes/bookings');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


var fs = require('fs');
var path = require('path');

const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

const router = express.Router();

app.get('/uploads/:folder/:file', function (req, res){
    file = req.params.file;
    folder = req.params.folder;
    let reqPath = path.join(__dirname, '../');
    var img = fs.readFileSync(reqPath + "uploads/" + folder + "/" +file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  });

app.use('/suppliers', supplierRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/location', locationRoutes);
app.use('/inventory',inventoryRoutes);
app.use('/users',userRoutes);
app.use('/bookings',bookingRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;