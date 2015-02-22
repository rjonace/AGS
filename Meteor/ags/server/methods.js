Meteor.methods({
	'prepareGrade' : function(id_User, id_Assignment, submission, path){
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		var counter = 0;
		var maxTime = 50;

		var fullSubObj = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		var folderName = fullSubObj._id + submission.subNumber;

		exec("mkdir " + path + "/" + folderName,
			function(error, stdout, stderr){
						console.log("error: "+ error);
						console.log("stdout: "+ stdout);
						console.log("stderr: "+ stderr);
					}
		);


		var folderCheck = setInterval(function(){
			console.log("Checking for Submission and Instructor Files in " + path + " " + counter);
			counter++;

			fs.readFile(path + '/written', 'utf8', function(error, data) {
				if (error && counter < maxTime) {
					//console.log(error);
					return;
				}
				else if (counter < maxTime) {
					exec("cp " + path + "/*" + " " + path + "/" + folderName);
				}
				else { 
					// exceeded max time
					console.log("Timed out");
				}

				clearInterval(folderCheck);
			});
		}, 1000);
	},
	'gradeCleanUp' : function(id_User, id_Assignment, submission, path){
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		var fullSubObj = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		var folderName = fullSubObj._id + submission.subNumber;

		//exec("mv " + path + "/" + folderName + "/results" + " " + path + "/" + folderName);
		exec("cat " + path + "/" + folderName + "/results/output.txt",
			function(error, stdout, stderr){
			 	if (!error){
						console.log("stdout: "+ stdout);
						AGSSubmissions.update(
							{
								"id_Student": id_User,
								"id_Assignment": id_Assignment,
								"AttemptList.subNumber": submission.subNumber
							}, 
							{ 
								$set: {
									"AttemptList.$.feedback": stdout
								} 
							} 
						);
						exec("rm -Rf " + path + "/" + folderName);
						exec("rm -Rf " + path + "/SubmissionFiles");
						exec("rm -Rf " + path + "/InstructorFiles");
						exec("rm -Rf " + path + "/written");
				}
			 }
		);

	},
	'gradeSubmission' : function(submission, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		// create temporary folder
		var randomFolderName = Math.floor(Math.random()*1000000);
		var counter = 0;
		var maxTime = 50;
		// check assignment language

		// may not need cd becuase passing path into exec sh
		exec("cd " + path,
			function(error, stdout, stderr){
				if(!error){
					console.log(stdout);
					console.log(stderr);
					exec("sh " + path + "/execjavafiles.sh " + randomFolderName + " " + path,
						function(inner_error, inner_stdout, inner_stderr){
							console.log("error: "+inner_error);
							console.log("stdout: "+inner_stdout);
							console.log("stderr: "+inner_stderr);
						}
					);
				} else {
					console.log(error);
				}
			}
		);


		var fileCheck = setInterval(function(){
			console.log("Checking for completed in " + path + " " + counter);
			counter++;

			fs.readFile(path + '/completed', 'utf8', function(error, data) {
				if (error && counter < maxTime) {
					//console.log(error);
					return;
				}
				else if (counter < maxTime) {
					console.log("Completed");
					fs.readFile(path + '/results/output.txt', 'utf8', function(inner_error, inner_data) {
						if(!inner_error)
							console.log(inner_data);
					})
				}
				else { 
					// exceeded max time
					console.log("Timed out");
				}

				// remove temp folder
				// this is done in the scripts
				//exec("rm -r " + path + '/' + randomFolderName);

				clearInterval(fileCheck);
			});
		}, 1000);

	},
	'writeSubmissionFiles' : function(submission, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		exec("mkdir " + path + "/SubmissionFiles",
			function(error, stdout, stderr){
			 	if (error){
			 		console.log(error + stdout + stderr);
			 	} else {
					fs.writeFile(path + "/SubmissionFiles/" + submission.filename, submission.contents, function(err){
						if(err){
							console.log(err);
						}
					});
				}
			 }
		);
	},
	'writeInstructorFiles' : function(assignment, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		exec("mkdir " + path + "/InstructorFiles",
			function(error, stdout, stderr){
			 	if (error){

			 		console.log(error + stdout + stderr);
			 	} else {
					/*fs.writeFile(path + "/InstructorFiles/" + assignment.vta.name, assignment.vta.contents, function(err){
						console.log(err);
						errorString = err;
					});*/
					fs.writeFile(path + "/InstructorFiles/" + assignment.ag.name, assignment.ag.contents, function(err){
						if(!err){
							exec("touch " + path + "/written");
						} else {
							console.log(err);
						}
					});
					/*for (var i=0; i < assignment.studentfiles.length; i++){
						fs.writeFile(path + "/InstructorFiles/" + assignment.studentfiles[i].name, assignment.studentfiles[i].contents, function(err){
							console.log(err);
							errorString += err;
						});
					}*/
				}
			 }
		);
	},
	'createUserData': function(id, first, last, id_Courses){
		AGSUsers.insert({
			_id: id,
			firstname: first,
			lastname: last,
			id_Courses: id_Courses
		}, function(err, id){
			if (err)
				console.log(err);
		});
	},
	'insertCourseData': function(name, number, semester, year) {
		var currentUserId = Meteor.userId();
		AGSCourses.insert({
			name: name,
			number: number,
			semester: semester,
			year: year,
			id_Instructor: currentUserId,
			id_Students: [],
			id_Assignments: []
		}, function(err,id){
			//AGSUsers.update(
			//	{_id:currentUserId},
			//	{ $addToSet: { id_Courses: id}}
			//);
		});
	},
	'removeCourseData': function(selectedCourse){
		AGSCourses.remove(selectedCourse);
		// remove all references to the course?
	},
	'enrollInCourse': function(selectedCourse){
		var currentUserId = Meteor.userId();
		AGSCourses.update(
			selectedCourse,
			{ $addToSet: { id_Students: currentUserId } }
		);
		AGSUsers.update( 
			{ _id: currentUserId },
			{ $addToSet: { id_Courses: selectedCourse._id} }
		);
		AGSUsers.update( 
			{ _id: selectedCourse.id_Instructor },
			{ $addToSet: { id_Students: currentUserId} }
		);
	},
	'createNewSubmission': function(id_User, id_Assignment, id_Instructor){
		var sub = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		if (!sub) {

			return AGSSubmissions.insert({
				id_Student: id_User,
				id_Assignment: id_Assignment,
				id_Instructor: id_Instructor,
				AttemptCount: 1,
				AttemptList: [{ name: 'Submission 1' , dateCreated: new Date() , subNumber : 0}]
			}, function(err, id) {
				console.log(err);
				AGSAssignments.update(
					{_id:id_Assignment},
					{ $addToSet: { id_Submissions: id}}
				);
			});

		} else {
			AGSSubmissions.update(
					sub,
					{ 	$inc: { AttemptCount: 1 },
						$addToSet: { AttemptList: { name: 'Submission ' + (sub.AttemptCount+1) , dateCreated: new Date(), subNumber : sub.AttemptCount } }
					}
			);
			return AGSSubmissions.findOne({
				id_Student: id_User,
				id_Assignment: id_Assignment
			});
		}
	},
	'insertSubmissionSolution' : function(id_Student, id_Assignment, subNumber, filename, contents){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$set: {
					"AttemptList.$.filename": filename, 
					"AttemptList.$.contents": contents
				} 
			} 
		);
	},
	'insertAssignmentData': function(id_Course, name, description, lang, dateAvailable, dateDue, points){

		return AGSAssignments.insert({
			name: name,
			description: description,
			language: lang,
			dateAvailable: dateAvailable,
			dateDue: dateDue,
			points: points,
			id_Course: id_Course
		}, function(err, id) {
			console.log(err);
			AGSCourses.update(
				{_id:id_Course},
				{ $addToSet: { id_Assignments: id}}
			);
		});
	},
	'insertAssignmentAG': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$set: { ag: { name: filename, contents: contents} } }
		);
	},	
/*	'insertAssignmentSolution': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$set: {solution: {name: filename, contents: contents} } }
		);
	},
*/
	'insertAssignmentStudent': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { studentfiles: { name: filename, contents: contents } } }
		);
	}
});