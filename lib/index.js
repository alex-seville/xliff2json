module.exports = Xliff2JSON;

var  fs = require('fs'),
      xml2js = require('xml2js'),
      _ = require("underscore");

function Xliff2JSON(options){
    var options = options || {};
    this.parser = new xml2js.Parser();
    this.cleanJSON = options.cleanJSON || false;
    this.xliffTemplate = options.xliffTemplate ||  'lib/xliff_template.xml'; //__dirname +
}

Xliff2JSON.prototype.parseXliff = function(xliff,cb){
    var that=this;
    this.parser.parseString(xliff, function (err, json) {
        if (that.cleanJSON){
            that._parseToCleanJSON(json,cb);
        }else{
            cb(json);
        }
    });
};

Xliff2JSON.prototype._parseToCleanJSON = function(json,cb){
  var output={};
  var root = json.xliff;
  var file = root.file[0];
  var language = file.$["target-language"];
  output[language]={};
  var fields = file.body[0]["trans-unit"];
  for(var i=0;i<fields.length;i++){
    var fieldname = fields[i].source[0];
      output[language][fieldname] = fields[i].target[0];
  }
  cb(output);
};

Xliff2JSON.prototype.parseJSON = function(xliffJson,cb){
  fs.readFile(this.xliffTemplate,'utf8', function(err, xliffTemplate) {
    cb(_.template(xliffTemplate,xliffJson));
  });
};

