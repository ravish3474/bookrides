//var http = require("http");
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

// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json);

// app.use((req, res, next)=>{
//     res.header("Access-Control-Allow-Origin","*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({});
//     }
//     next();
// })

app.use('/suppliers', supplierRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/location', locationRoutes);
app.use('/inventory',inventoryRoutes);
app.use('/users',userRoutes);

// app.use((req, res, next)=>{
//     console.log(req.url);
//     res.status(200).json({
//         message:'it works'
//     });
// });

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

//http.createServer(function(req,resp){
    //console.log(req);
//     switch (req.method){
//         case "GET":
//             if(req.url === "/"){
//                 httpMsgs.showHome(req, resp);
//             }
//             else if (req.url === "/employee"){
//                 emp.getList(req,resp);
//             }
//             else{
//                 var empnoPatt = "[0-9]+";
//                 var patth = new RegExp("/employee/"+ empnoPatt);
//                 if(patth.test(req.url)){
//                     patt = new RegExp(empnoPatt);
//                     var empno = patt.exec(req.url);
//                     emp.get(req, resp , empno);
//                 }
//                 else{
//                     httpMsgs.show404(req, resp);
//                 }
//             }
//         break;
//         case "POST":
//             if(req.url === "/employee"){
//                 var reqBody = '';
//                 req.on("data",function(data){
//                     reqBody +=data;
//                     //console.log(reqBody);
//                     if(reqBody > 1e7) //10MB
//                     {
//                         httpMsgs.show413(req, resp);
//                     }
//                 });

//                 req.on("end",function(){
//                     emp.add(req, resp, reqBody);
//                 });
//             }
//             else{
//                 httpMsgs.show404(req, resp);
//             }
//         break;
//         case "PUT":
//             if(req.url === "/employees"){

//             }
//             else{
//                 httpMsgs.show404(req,resp);
//             }
//         break;
//         case "DELETE":
//             if(req.url === "/employees"){

//             }
//             else{
//                 httpMsgs.show404(req,resp);
//             }
//         break;
//         default:
//             httpMsgs.show405(req, resp);
//             break;
//     }

// }).listen(settings.webPort,function(){
//     console.log("Starting Server at: "+settings.webPort);
// })