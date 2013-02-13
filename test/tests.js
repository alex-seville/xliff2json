var assert = require("assert"),
	fs = require('fs');

var xliff2json = require("../lib/index");

function normalizeWhitespace(str) {
  return str.replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n');
}

var x1 = new xliff2json();
var x2 = new xliff2json({
    cleanJSON:true,
    decorateJSON:true
  });

var input = fs.readFileSync("test/fixture/test_less.xml",'utf8');
var inOdd= fs.readFileSync("test/fixture/oddities.xml",'utf8');
var outOdd= fs.readFileSync("test/fixture/oddities_out.xml",'utf8');

describe('Round trip', function(){
    it('just to xliff', function(done){
      x1.parseXliff(input,function(xliffJson){
        x1.parseJSON(xliffJson,function(output){
          assert.equal(normalizeWhitespace(output),normalizeWhitespace(input));
          done();
        });
      });
    });
    it('to json', function(done){
      x2.parseXliff(input,function(json){
         x2.parseJSON(json,function(output){
           assert.equal(normalizeWhitespace(output),normalizeWhitespace(input));
           done();
         });
      });
    });
    it('oddities to xliff', function(done){
      x1.parseXliff(inOdd,function(xliffJson){
        x1.parseJSON(xliffJson,function(output){
          assert.equal(normalizeWhitespace(output),normalizeWhitespace(outOdd));
          done();
        });
      });
    });
});
