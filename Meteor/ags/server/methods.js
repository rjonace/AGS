Meteor.methods({
	'prepareGrade' : function(id_User, id_Assignment, submission, path){
		console.log("prep start");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		var fullSubObj = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		var folderName = fullSubObj._id + submission.subNumber;
		var newPath = path + "/" + folderName;
		
		fs.mkdirSync(newPath);
		console.log("prep mkdir over");
		return folderName;
	},
	'gradeCleanUp' : function(path, folderName){
		var exec = Npm.require('child_process').exec;

		exec("rm -Rf " + path + "/" + folderName);
	},
	'gradeSubmission' : function(submission, path, folderName, id_User, id_Assignment) {		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		// create temporary folder
		var randomFolderName = Math.floor(Math.random()*1000000);
		var counter = 0;
		var maxTime = 50;
		// check assignment language

		var newPath = path + "/" + folderName;

		// may not need cd becuase passing path into exec sh
		exec("cp " + path + "/*.* " + newPath,
			function(error, stdout, stderr){
				if(!error){
					console.log(stdout);
					console.log(stderr);
					exec("sh " + newPath + "/execjavafiles.sh " + randomFolderName + " " + newPath,
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

		var outputData;
		var fileCheck = setInterval(function(){
			console.log("Checking for completed in " + newPath + " " + counter);
			counter++;

			fs.readFile(newPath + '/completed', 'utf8', function(error, data) {
				if (error && counter < maxTime) {
					//console.log(error);
					return;
				}
				else if (counter < maxTime) {
					console.log("Completed");
					outputData = fs.readFileSync(newPath + '/results/output.txt', 'utf8');

				}
				else { 
					// exceeded max time
					console.log("Timed out");
				}

				clearInterval(fileCheck);
			});
		}, 1000);

		while(fs.readFileSync(newPath + '/completed', 'utf8') == null);
		outputData = fs.readFileSync(newPath + '/results/output.txt', 'utf8');

		AGSSubmissions.update(
		{
			"id_Student": id_User,
			"id_Assignment": id_Assignment,
			"AttemptList.subNumber": submission.subNumber
		}, 
		{ 
			$set: {
				"AttemptList.$.feedback": outputData
			} 
		});

	},
	'writeSubmissionFiles' : function(submission, path) {
		console.log("sub start");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var newPath = path + "/SubmissionFiles";
		console.log("sub check 1");
		fs.mkdirSync(newPath);
		console.log("sub check 2");
		fs.writeFileSync(newPath + "/" + submission.filename, submission.contents);
		console.log("sub end");
	},
	'writeInstructorFiles' : function(assignment, path) {
		console.log("ins start");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var newPath = path + "/InstructorFiles";
		
		console.log("ins check 1");
		fs.mkdirSync(newPath);
		console.log("ins check 2");
		fs.writeFileSync(newPath + "/" + assignment.ag.name, assignment.ag.contents);
		console.log("ins end");
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
		return AGSSubmissions.findOne({ id_Student: id_Student, id_Assignment: id_Assignment }).AttemptList[subNumber];
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