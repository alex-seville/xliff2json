var assert = require("assert"),
	fs = require('fs');

var xliff2json = require("../lib/index");

var x1 = new xliff2json();
var x2 = new xliff2json({cleanJSON:true});

var input = fs.readFileSync("test/fixture/test.xml",'utf8');
var output = fs.readFileSync("test/fixture/test.json",'utf8');
var outputClean = fs.readFileSync("test/fixture/test_clean.json",'utf8');

var inputJSON = fs.readFileSync("test/fixture/test2.json",'utf8');
var outputJSON = fs.readFileSync("test/fixture/test2.xml",'utf8');

describe('XliffToJSON', function(){
  it('it should return json', function(done){
    x1.parseXliff(input,function(json){
       assert(json,output);
       done();
    });
  });
   it('it should return clean json', function(done){
      x2.parseXliff(input,function(json){
        assert(json,outputClean);
        done();
      });
  });
});

describe('JSONToXliff', function(){
  it('it should return xml', function(done){
     x1.parseJSON(JSON.parse(inputJSON),function(xliff){
        assert(xliff,outputJSON);
        done();
      });
  });
});
