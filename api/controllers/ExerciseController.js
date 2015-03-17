/**
 * ExerciseController
 *
 * @description :: Server-side logic for managing exercises
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var exec = require('child_process').exec;

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var appRoot = require('app-root-path');
var resol = appRoot + '/lib/resolutionExercise.jar';

var openshiftJavaPath = '$OPENSHIFT_DATA_DIR/jdk1.8.0_20/bin/';

module.exports = {

  index: function(req, res){
    //todo glob var java
    exec(openshiftJavaPath+'java -jar '+resol+' latex=1 maxVars=6',
      function (error, stdout, stderr){
        if(error !== null){
          return res.end(error+"");
        }
        decorateOutput(stdout, function(task, transform, execute){
          sails.log.debug(task);
          res.view({task: task, transform: transform, execute: execute});
        });
      }
    );
  }

};

function decorateOutput(content, callback){
  var t = content.split("\n").map(function(i){
    return i+'</br>'
  });
  var res = [];

  var j;
  for (i = 0; i < t.length; i++) {
    var row = t[i];
    j=i;
    //cleancode powa
    if(j>=14){
      var dot = row.indexOf('.');
      if(dot==5 || dot ==6){
        j=42;
      }else{
        row = row.replace("Sigma \\models  F", "$Sigma \\models  F$");
      }
    }
    switch (j) {
      case 6:
        row = "$$"+row+"$$";
        break;
      case 9:
        row = row.replace("Sigma", "$Sigma$");
        row = row.replace("\\neg", "$\\neg$");
        break;
      case 11:
        row = "$$"+row+"$$";
        break;
      case 13:
        row = row.replace("Sigma'", "$Sigma'$");
        break;
      case 42:
        row = "&nbsp;&nbsp;&nbsp;&nbsp;"+row;
        row = row.replace("\\{", "$\\{");
        row = row.replace("\\}", "\\}$ &nbsp;&nbsp;&nbsp;");
        row = row.replace("Res", "Res ");
        row = row.replace("Sigma'", "$Sigma'$");
        break;
    }
    row = row.replace("\\Box", "$\\Box$");

    res.push(row);
  }

  var task='', transform='', execute ='';
  for (i = 0; i < t.length; i++) {
    if(i<7){
      task+=res[i];
    }else if(i<12){
      transform+=res[i];
    }else{
      execute+=res[i];
    }
  }
  callback(task, transform, execute);

}
