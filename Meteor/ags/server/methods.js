Meteor.methods({

/*	Server side User methods*/
	'createUserData': function(id, first, last, id_Courses){
		AGSUsers.update(
		{_id:id},			//selector
		{					//modifier
			_id: id,
			firstname: first,
			lastname: last,
			id_Courses: id_Courses
		},
		{upsert : true},	//options
		 function(err, id){	//callback
			if (err)
				console.log(err);
			else
				console.log(id);
		});
	},
	'checkCourseKey' : function(courseKey) {
		return AGSCourses.findOne({key:courseKey});
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

/*	Server side Course Methods*/
	'insertCourseData': function(name, number, semester, year, description) {
		var currentUserId = Meteor.userId();
		var courseKey = AGSCourses._makeNewID();
		AGSCourses.insert({
			name: name,
			number: number,
			semester: semester,
			year: year,
			description: description,
			key: courseKey,
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
	'updateCourseData' :function(id, name, number, semester, year, description){
		AGSCourses.update(
		{_id:id},			//selector
		{$set: {					//modifier
			name: name,
			number: number,
			semester: semester,
			year: year,
			description: description
		}},
		{upsert : false},	//options
		 function(err, result){	//callback
			if (err)
				console.log(err);
		});
	},
	'removeCourseData': function(id_Course){
		AGSCourses.remove({_id:id_Course});
		AGSUsers.update(
			{},
			{ $pull : 
				{id_Courses: id_Course}
			},
			{ multi:true });
		AGSAssignments.remove({id_Course:id_Course});
		// remove all references to the course?
	},
	'resetCurrentCourse': function(id_Course){
		return AGSCourses.findOne({_id:id_Course});
	},

/*	Server side Assignment Methods*/
	'insertAssignmentData': function(id_Course, name, description, lang, dateAvailable, dateDue, time, points){

		return AGSAssignments.insert({
			name: name,
			description: description,
			language: lang,
			dateAvailable: dateAvailable,
			dateDue: dateDue,
			time: time,
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
	'insertAssignmentStudent': function(id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { studentfiles: { name: filename, contents: contents } } }
		);
	},
	'updateAssignmentData' : function(id_Assignment, name, description, lang, dateAvailable, dateDue, time, points){
		AGSAssignments.update(
		{_id:id_Assignment},
		{ $set: {
			name: name,
			description: description,
			language: lang,
			dateAvailable: dateAvailable,
			dateDue: dateDue,
			time: time,
			points: points
		}},{upsert : false},	//options
		 function(err, result){	//callback
			if (err)
				console.log(err);
		});
	},
	'removeAssignmentData': function(id_Assignment){
		AGSAssignments.remove({_id:id_Assignment});
		AGSCourses.update(
			{},
			{ $pull : 
				{id_Assignments: id_Assignment}
			},
			{ multi:true });
		AGSSubmissions.remove({id_Assignment:id_Assignment});
		// remove all references to the assignemnt?
	},
	'resetCurrentAssignment' : function(id_Assignment){
		return AGSAssignments.findOne({_id:id_Assignment});
	},

/*	Server side Submission methods*/
	'createNewSubmission': function(id_User, id_Assignment, id_Instructor){
		var sub = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		var student = AGSUsers.findOne({_id:id_User});
		var studentName = student.lastname + ", " + student.firstname;

		if (!sub) {

			return AGSSubmissions.insert({
				id_Student: id_User,
				id_Assignment: id_Assignment,
				id_Instructor: id_Instructor,
				AttemptCount: 1,
				AttemptList: [{ id_Student: id_User, studentName: studentName, name: 'Submission 1' , dateCreated: new Date() , subNumber : 0}]
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
						$addToSet: { AttemptList: { id_Student: id_User, studentName: studentName, name: 'Submission ' + (sub.AttemptCount+1) , dateCreated: new Date(), subNumber : sub.AttemptCount } }
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
				// $set: {
				// 	"AttemptList.$.filename": filename, 
				// 	"AttemptList.$.contents": contents
				// } 
				$addToSet : {
					"AttemptList.$.files": { name : filename, contents : contents }
				}
			} 
		);
		return AGSSubmissions.findOne({ id_Student: id_Student, id_Assignment: id_Assignment });
	},
	'resetSubmissionSession' : function(id_User, id_Assignment, submission) {
		return AGSSubmissions.findOne({ id_Student: id_User, id_Assignment: id_Assignment }).AttemptList[submission.subNumber];
	},

/*	Server side Auto Grading methods*/
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
	'writeSubmissionFiles' : function(submission, path) {
		console.log("sub start");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var newPath = path + "/SubmissionFiles";
		console.log("sub check 1");
		fs.mkdirSync(newPath);
		console.log("sub check 2");
		for (int i = 0; i < submission.files.length; i++){
			fs.writeFileSync(newPath + "/" + submission.files[i].name, submission.files[i].contents);
		}
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
	'gradeSubmission' : function(submission, path, folderName, id_User, id_Assignment, assignmentLang) {		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		// create temporary folder
		var randomFolderName = Math.floor(Math.random()*1000000);
		var counter = 0;
		var maxTime = 50;
		// check assignment language

		var newPath = path + "/" + folderName;
		var subNumber = submission.subNumber;
		var fileToExec = "";
		if (assignmentLang == "Java")
			fileToExec = "/execjavafiles.sh ";
		if (assignmentLang == "C")
			fileToExec = "/execcfiles.sh ";

		// may not need cd becuase passing path into exec sh
		exec("cp " + path + "/*.* " + newPath,
			function(error, stdout, stderr){
				if(!error){
					console.log(stdout);
					console.log(stderr);
					exec("sh " + newPath + fileToExec + randomFolderName + " " + newPath,
						function(inner_error, inner_stdout, inner_stderr){
							var execData = {
								error: inner_error,
								stdout: inner_stdout,
								stderr:inner_stderr
							}
							fs.writeFileSync(newPath + '/results/errors.txt',
							 '<h4>Errors</h4><pre>' + execData.stderr + '</pre>');
						}
					);
				} else {
					console.log(error);
				}
			}
		);

		var outputData;
		var fileCheck = Meteor.setInterval(function(){
			console.log("Checking for completed in " + newPath + " " + counter);
			counter++;

			fs.readFile(newPath + '/completed', 'utf8', Meteor.bindEnvironment(function(error, data) {
				if (error && counter < maxTime) {
					//console.log(error);
					return;
				}
				else if (counter < maxTime) {
					console.log("Completed");
					try{
						outputData = fs.readFileSync(newPath + '/results/output.txt', 'utf8');
						outputData += fs.readFileSync(newPath + '/results/errors.txt', 'utf8');
						console.log(outputData);
						AGSSubmissions.update({id_Student: id_User, id_Assignment: id_Assignment, "AttemptList.subNumber":subNumber}, {$set: {"AttemptList.$.feedback":outputData}});

					}catch(e){
						console.log(e.message);
						console.log("didn't get output.");
					}
				}
				else { 
					// exceeded max time
					console.log("Timed out");
				}

				Meteor.clearInterval(fileCheck);
			}))
		}, 1000);
	},
	'gradeCleanUp' : function(path, id_User, id_Assignment, submission){
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		if (path)
			exec("rm -Rf " + path);
	}
});