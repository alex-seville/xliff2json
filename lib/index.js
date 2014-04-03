module.exports = Xliff2JSON;

var  fs = require('fs'),
      xml2js = require('xml2js'),
      _ = require("underscore");

function Xliff2JSON(options){
    var options = options || {};
    this.parser = new xml2js.Parser();
    this.cleanJSON = options.cleanJSON || false;
    this.decorateJSON = options.decorateJSON || false;
    this.xliffTemplate = options.xliffTemplate ||  __dirname+'/xliff_template.xml';
}

Xliff2JSON.prototype.parseXliff = function(xliff,options,cb){
    var that=this;
    if (typeof xliff !== 'string'){
      throw new Error("xliff parameter must be a string.");
    }
    if (arguments.length === 2){
       cb = options;
       options = {};
    }else{
      options = options || {};
    }
    if (typeof cb !== 'function'){
      throw new Error("callback must be a function");
    }
    this.parser.parseString(xliff, function (err, json) {
        if (that.cleanJSON){
            that._parseXliffToCleanJSON(json,options,cb);
        }else{
            cb(json);
        }
    });
};

Xliff2JSON.prototype._parseXliffToCleanJSON = function(json,options,cb){
   if (typeof json !== 'object'){
      throw new Error("xliff parameter must be JSON.");
    }
    if (typeof json.xliff === 'undefined' || typeof json.xliff.file === 'undefined' || json.xliff.file.length === 0){
      throw new Error("xliff parameter must be valid xliff JSON.");
    }
    if (typeof cb !== 'function'){
      throw new Error("callback must be a function");
    }
  var output={};
  var root = json.xliff;
  var newRoot = output;
  var file = root.file[0];
  var language = file.$["target-language"];
  if (options.languageHeader){ newRoot = output[language]={}; }
  var fields = file.body[0]["trans-unit"];
  for(var i=0;i<fields.length;i++){
    var fieldname = fields[i].source[0];
      newRoot[fieldname] = fields[i].target[0];
  }
  cb(output);
};

Xliff2JSON.prototype.parseJSON = function(xliffJson,options,cb){
  var that =this;
   if (typeof xliffJson !== 'object'){
      throw new Error("xliff parameter must be JSON.");
    }
    if (arguments.length === 2){
       cb = options;
       options = {};
    }else{
      options = options || {};
    }
    if (typeof cb !== 'function'){
      throw new Error("callback must be a function");
    }
  fs.readFile(this.xliffTemplate,'utf8', function(err, xliffTemplate) {
    var template = _.template(xliffTemplate);
    if (that.decorateJSON){
      that._parseJSONAndDecorate(xliffJson,options,function(decoratedJson){
          cb(template(_.extend(decoratedJson,{
                                        __XMLEscape: function (str){
                                            return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");//.replace(/"/g, "&quot;");
                                          }
                                      })));
      });
    }else{
      cb(template(_.extend(xliffJson,{
                                        __XMLEscape: function (str){
                                            return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");//.replace(/"/g, "&quot;");
                                          }
                                      })));
    }
  });
};

Xliff2JSON.prototype._parseJSONAndDecorate = function(json,options,cb){
   if (typeof json !== 'object'){
      throw new Error("json parameter must be JSON.");
    }
    if (typeof options !== 'object'){
      throw new Error("options parameter must be an object.");
    }
    if (typeof cb !== 'function'){
      throw new Error("callback must be a function");
    }
    var language = options.destLanguage || 'fr';
    var output={
      xliff: {
        "$": {
          "version":"1.0"
        },
        "file":[{
            "$": {
              "source-language": options.srcLanguage || "en",
              "target-language": options.destLanguage || "fr",

              "datatype": options.dataType || "plaintext",
              "original": options.original || "messages",
              "product-name": options.productName || "messages"
            },
            "header": [{}],
            "body": [{
              "trans-unit": []
            }]
        }]
      }
   };
  var translations = json[language] || json;
  var translationKeys = Object.keys(translations);

  var transUnits = {};
  for(var i=0;i<translationKeys.length;i++){
    var translationTarget = translations[translationKeys[i]];

    var targetValue = translationTarget;
     var unit = {
        "$": {"id": (i+1).toString() },
        "source": [translationKeys[i]],
        "target": [targetValue]
      };
      output.xliff.file[0].body[0]["trans-unit"].push(unit);
  }
  cb(output);
};

