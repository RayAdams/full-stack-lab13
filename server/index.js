var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var clientPath = path.join(__dirname, '../client');

var server = http.createServer(function(req, res) {
        var urlData = url.parse(req.url, true);
        if(urlData.pathname === '/' && req.method === 'GET'){
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(path.join(clientPath,'index.html')).pipe(res);
        } 
        else if (urlData.pathname === '/api/chirps'){
            if (req.method === "GET") {
                    res.writeHead(200, {"Content-Type": "application/json"});                    
                    fs.createReadStream(path.join(__dirname, 'data.json')).pipe(res);
            }
            else if (req.method === "POST"){
                fs.readFile(path.join(__dirname, 'data.json'), 'utf8', function (err, data){
                    if (err){
                        console.log(err);
                    }
                    else {
                        var currentChirps = JSON.parse(data);
                        var incomingData = '';
                        req.on('data', function(chunk){
                            incomingData += chunk;
                        });
                        req.on('end', function(){
                            var newChirp = JSON.parse(incomingData);
                            currentChirps.push(newChirp);
                            fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(currentChirps), function (err, data){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    res.writeHead(201, {"Content-Type": "application/json"});
                                    res.end('{}');
                                }
                            });
                        });

                    }
                });
            }
        } 
        else if (req.method === 'GET'){
            var filePath = path.join(clientPath, urlData.pathname);
            var readStream = fs.createReadStream(filePath);
            readStream.on('error', function(e){
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('File Not Found');
            });
            var extension = path.extname(filePath);
            var contentType;
            //if adding image files, will have to add png/img
            if (extension === '.html'){
                contentType = 'text/html';
            } 
            else if (extension === '.css'){
                contentType = 'text/css';
            } 
            else if (extension === '.js'){
                contentType = 'text/javascript';
            } 
            else {
                contentType = 'text/plain';
            }

            res.writeHead(200, {'Content-Type': contentType});
            readStream.pipe(res);
        }
});
        // else {
        //     //error handling
        //     var filePath = path.join(clientPath, urlData.pathname);
        //     var readStream = fs.createReadStream(filePath);
        //     readStream.on('error', function(e){
        //         res.writeHead(404, {'Content-Type': 'text/plain'});
        //         res.end('File Not Found');
        //     });
        //     //extension handling
        //     var extension = path.extname(filePath);
        //     var contentType;
        //     if(extension === '.html'){
        //         contentType = 'text/html';
        //     } else if(extension === '.css'){
        //         contentType = 'text/css';
        //     } else if(extension === '.js'){
        //         contentType = 'text/javascript';
        //     } else {
        //         res.writeHead(404, {'Content-Type': 'text/plain'});
        //         res.end('File Not Found');
        //     }
        //     // res.writeHead(200, {'Content-Type': contentType});
        //     // res.end();
        // }
// });

server.listen(3000);