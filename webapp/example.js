var sys = require('sys'),
	exec = require('child_process').exec;
// cd to webapp
// run mongod
//exec("mongod",puts);
// run node with the app file
//exec("node app.js",puts);

/*wget( 
	getCreateLink( 'localhost', '3000', 'users'),
	simpleMakeUser("proff","Dr Instructor","passw")
)

wget( 
	getCreateLink( 'localhost', '3000', 'courses'),
	simpleMakeCourse("Computer Stuff 2","COP1234","54bd706e80220d8f76d40b34")
)*/


/* @function
* @param {String} host
* @param {String} port
* @param {String} obj_type 
* @returns {String} link string to be used with wget function
*/
function getCreateLink( host, port, obj_type) {
	return linkString = "http://" + host + ":" + port + "/" + obj_type + "/create \\";
}

/* @function
* @param {String} link
* @param {String} data
* @returns {Object} whatever returns from the exec function
*/
function wget( link, data) {
	var child = exec(	"wget " + link + "--header='content-type: application/json' \\"
						     	+ "--post-data='" + data + "' -O -",
						function (error, stdout, stderr) {
								sys.print('stdout: ' + stdout);
								sys.print('stderr: ' + stderr);
								if (error !== null) {
									console.log('exec error: ' + error);
								}
						});
	return child;
}

/* @function
* @param {String} username
* @param {String} name
* @param {String} password
* @returns {String} simple user object with passed in info in JSON format
*/
function simpleMakeUser( username, name, password) {
	var tempUser = {
		is_online: true,
		username: username,
		password: password,
		name: name,
		email: username+"@email.com",
		isInstructor: true,
		isStudent: false,
		id_Courses: [],
		id_Assignments: [],
		id_Students: [],
		id_Submissions: []
	};

	return JSON.stringify(tempUser);
}

/* @function
* @param {String} title
* @param {String} number
* @param {Object} instructor instructor of course
* @returns {String} simple course object with passed in info in JSON format
*/
function simpleMakeCourse( title, number, instructor ) {
	var tempCourse = {
		title: title,
		number: number,
		id_Instructor: instructor,
		id_Students: [],
		id_Assignments:[]
	};

	return JSON.stringify(tempCourse);
}

function simplerMakeCourse( title, number ) {
	var tempCourse = {
		title: title,
		number: number,
		id_Instructor: "",
		id_Students: [],
		id_Assignments:[]
	};

	return JSON.stringify(tempCourse);
}

/*


wget http://localhost:3000/users/create \
--header='content-type: application/json' \
--post-data='{ "is_online" : true,
	"username" : "user2",
	"password" : "pass2",
	"name" :	"user two",
	"email" : "user2email@gmail.com",
	"isInstructor" : false,
	"isStudent" : true,
	"id_Courses" : [],
	"id_Assignments" : [],
	"id_Students" : [],
	"id_Submissions" : []
}' -O -


*/