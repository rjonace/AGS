Meteor.methods({
	'gradeSubmission' : function(submission, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		// create temporary folder
		var randomFolderName = Math.floor(Math.random()*1000000);
		var counter = 0;
		var maxTime = 20;
		// check assignment language

		// may not need cd becuase passing path into exec sh
		exec("cd " + path,
			function(error, stdout, stderr){
				if(!error){
					console.log(stdout);
					console.log(stderr);
					exec("sh " + path + "execjavafiles.sh " + randomFolderName + " " + path,
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
			console.log("Checking for completed in " + path + randomFolderName + " " + counter);
			counter++;

			fs.readFile(path + randomFolderName + '/completed', 'utf8', function(error, data) {
				if (error && counter < maxTime) {
					console.log(error);
					return;
				}
				else if (counter < maxTime) {
					console.log("Completed");
					fs.readFile(path + randomFolderName + '/output.txt', 'utf8', function(inner_error, inner_data) {
						if(!inner_error)
							console.log(inner_data);
					})
				}
				else { 
					// exceeded max time
					console.log("Timed out");
				}

				// remove temp folder
				exec("rm -r " + path + randomFolderName);

				clearInterval(fileCheck);
			});
		}, 1000);

	},
	'writeFiles' : function(assignment, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		//make studentfiles directory
		exec("mkdir " + path + "/InstructorFiles",
			function(error, stdout, stderr){
			 	if (error){
			 		console.log(error + stdout + stderr);
			 	} else {
					fs.writeFile(path + "/InstructorFiles/" + assignment.vta.name, assignment.vta.contents, function(err){
						console.log(err);
					});
					fs.writeFile(path + "/InstructorFiles/" + assignment.solution.name, assignment.solution.contents, function(err){
						console.log(err);
					});
					for (var i=0; i < assignment.inputs.length; i++){
						fs.writeFile(path + "/InstructorFiles/" + assignment.inputs[i].name, assignment.inputs[i].contents, function(err){
							console.log(err);
						});
					}
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
			AGSUsers.update(
				{_id:currentUserId},
				{ $addToSet: { id_Courses: id}}
			);
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
			{ $addToSet: { id_Courses: selectedCourse._id } }
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
				AttemptList: [{ name: 'Submission 1' , dateCreated: new Date() }]
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
						$addToSet: { AttemptList: { name: 'Submission ' + (sub.AttemptCount+1) , dateCreated: new Date() } }
					}
			);
			return AGSSubmissions.findOne({
				id_Student: id_User,
				id_Assignment: id_Assignment
			});
		}
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
	'insertAssignmentVTA': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$set: { vta: { name: filename, contents: contents} } }
		);
	},	
	'insertAssignmentSolution': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$set: {solution: {name: filename, contents: contents} } }
		);
	},
	'insertAssignmentInput': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { inputs: { name: filename, contents: contents } } }
		);
	}
});