//test



var sandBox = require('./DockerSandbox');

function random(size) {
    //returns a crypto-safe random
    return require("crypto").randomBytes(size).toString('hex');
};

var language = 'C';
var code = "#include <stdio.h>\nint main() {\nprintf(\"Hello\n\");\nreturn 0;\n}"
var stdin = ""

var folder= 'temp/' + random(10); //folder in which the temporary folder will be saved
var path=__dirname+"/"; //current working path
console.log(path);
var vm_name="ags-vm"; //name of virtual machine that we want to execute
var timeout_value=20;//Timeout Value, In Seconds

//details of this are present in DockerSandbox.js
var sandboxType = new sandBox(timeout_value
	,path
	,folder
	,vm_name
	,"\'gcc -o /usercode/a.out\'"
	,"file.c"
	,code
	,"/usercode/a.out"
	,"C"
	," "
	,stdin);


//data will contain the output of the compiled/interpreted code
//the result maybe normal program output, list of error messages or a Timeout error
sandboxType.run(function(data,exec_time,err)
{
    //console.log("Data: received: "+ data)
	console.log({output:data, langid: language,code:code, errors:err, time:exec_time});
});
