/**
 * Created by pataiadam on 2015.03.16..
 */

var http = require('http');
var exec = require('child_process').exec;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    exec('java -jar resolutionExercise.jar latex=1 maxVars=6',
        function (error, stdout, stderr){
            if(error !== null){
                return res.end(error);
            }

            decorateOutput(stdout, function(a){
                htmlBuilder(a, function(result){
                    res.write(result);
                    return res.end();
                });
            });
        }
    );
}).listen(8080, '127.0.0.1');


function htmlBuilder(content, callback){
    var body = "<body>"+content+"</body>";
    var script1 = "<script type=\"text/x-mathjax-config\"> MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}}); </script>";
    var script2 = "<script type=\"text/javascript\" src=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML\"> </script>";
    var head = "<head>"+script1+script2+"</head>";
    callback("<html>"+head+body+"</html>");
}

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
            case 11:
                row = "$$"+row+"$$";
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


    var c='';
    res.map(function(i){
        c+=i;
    })
    callback(c);

}