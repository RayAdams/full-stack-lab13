var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

//CHECK THIS PATH AND ADD TO BELOW CODE
var clientPath = path.join(__dirname, '../client');

var server = http.createServer(function(req, res) {
        var urlData = url.parse(req.url, true);
        if(urlData.pathname === '/' && req.method === 'GET'){
            fs.readFile('./client/index.html',function (err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        } 
        else if (urlData.pathname === '/api/chirps'){
            if (req.method === "GET") {
                    res.writeHead(200, {"Content-Type": "application/json"});                    
                    var src = fs.createReadStream('server/data.json');
                    src.pipe(res);
            }
            if (req.method === "POST"){
                // fs.writeFile('server/data.json',function (err) {
                //     if (err) console.log(err);
                // });
                //read json from server and convert file type from json to js
                fs.readFile('server/data.json',function (err, data){
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.write(data);
                    res.end(JSON.stringify(data));
                    //push to array and turn back to JSON
                });
            }
        } 
        else {
            //error handling
            res.writeHead(404);
            res.end('File Not Found');
        }
});

server.listen(3000);