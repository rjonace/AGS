var runAndCompile,
fileInfo = {
	filename : "test.c",
	filetype : "C" },

assignmentInfo = {
	name : "Test Assignment",
	language : "C"
	compileFlags : ['Wall','v','lm'],
	inputFile : "test.in" },

user = { student : "Joe Blogs" },
outputLocation = "~/AGSserverTest/output";

var exec = require('child_process').exec;

var runAndCompile = function(fileInfo, user, assignmentInfo, outputLocation) {
	

}

var runCompile =


return 
{ 
	runCompile : runCompile,
}

- vta api module
- connects professor code to vta api
	- writing wrappers?
	- scanning code?
- file system module
	- move files
	- create directorys
	- interface with database
- compile files module
- security module
	- sandboxing?
	- vm?
	- scanning?
- 
- connect to rest of system
	- database
	- front end