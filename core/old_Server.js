// var http = require("http");
// var emp = require("../controllers/employee");
// var settings = require("../settings");
// var httpMsgs = require("./httpMsgs");

http.createServer(function(req,resp){
    //console.log(req);
    switch (req.method){
        case "GET":
            if(req.url === "/"){
                httpMsgs.showHome(req, resp);
            }
            else if (req.url === "/employee"){
                emp.getList(req,resp);
            }
            else{
                var empnoPatt = "[0-9]+";
                var patth = new RegExp("/employee/"+ empnoPatt);
                if(patth.test(req.url)){
                    patt = new RegExp(empnoPatt);
                    var empno = patt.exec(req.url);
                    emp.get(req, resp , empno);
                }
                else{
                    httpMsgs.show404(req, resp);
                }
            }
        break;
        case "POST":
            if(req.url === "/employee"){
                var reqBody = '';
                req.on("data",function(data){
                    reqBody +=data;
                    //console.log(reqBody);
                    if(reqBody > 1e7) //10MB
                    {
                        httpMsgs.show413(req, resp);
                    }
                });

                req.on("end",function(){
                    emp.add(req, resp, reqBody);
                });
            }
            else{
                httpMsgs.show404(req, resp);
            }
        break;
        case "PUT":
            if(req.url === "/employees"){

            }
            else{
                httpMsgs.show404(req,resp);
            }
        break;
        case "DELETE":
            if(req.url === "/employees"){

            }
            else{
                httpMsgs.show404(req,resp);
            }
        break;
        default:
            httpMsgs.show405(req, resp);
            break;
    }

}).listen(settings.webPort,function(){
    console.log("Starting Server at: "+settings.webPort);
})