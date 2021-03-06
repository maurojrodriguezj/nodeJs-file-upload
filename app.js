/*
 * Author: Rohit Kumar
 * Date: 24-07-2014
 * Website: iamrohit.in
 * App Name: Node File Upload
 * Description: File upload module in nodeJs with progress bar
 */
/**
 * Module dependencies.
 */
var config = require('./config');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
process.env.TMPDIR = config.TEMPDIR;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {  
     fs.readdir(config.UPLOADDIR,function(err, list) {
       if(err)
         throw err;
     res.render('fileUpload',{fileList:list});
     });
});

app.get('/deleteFile/:file', function(req, res){
var targetPath = config.UPLOADDIR+req.param("file");
  
    
     fs.unlink(targetPath,function(err) {
       if(err) {
        res.send("Error to delete file: "+err);
        } else {
        res.send("File deleted successfully!");
        }
     })
   
  
});

app.get('/users', user.list);
app.get('/fileUpload', routes.fileUpload);
app.get('/filelist', function(req, res) {
fs.readdir(config.UPLOADDIR,function(err, list) {
       if(err)
         throw err;
     res.render('filelist',{fileList:list});
     });

});

app.post('/fileUpload', function(req, res) {  
  var tempPath = req.files.uploadfile.path;
 var targetPath = config.UPLOADDIR+req.files.uploadfile.name;
  fs.rename(tempPath, targetPath, function(err) {
     if(err) { 
        //res.send("Error found to upload file "+err);
        var msg = "Error found to upload file "+err;
        var type="error"; 
     } else {
        //res.send("<b>File uploaded to "+targetPath+" ("+req.files.uploadfile.size +" bytes)</b>");
        var fileSize = req.files.uploadfile.size/1024;
        var msg = "File uploaded to "+targetPath+" ("+(fileSize.toFixed(2)) +" kb)";
        var type="success";
        res.send(req.files.uploadfile.name);
     }
    
     
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
