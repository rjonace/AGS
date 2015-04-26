/*	Server side Auto Grading methods*/
Meteor.methods({
	'createErrorJSONFile' : function(error, path){
		var fs = Npm.require('fs');
		var data = { error: error };
		fs.writeFileSync(path + '/errorfeedback.json', JSON.stringify(data));
	},
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
	'gradeSubmission' : function(submission, path, assignment, compileFlags) {
		console.log("sub start");
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var language = assignment.language;
		
		for (var i = 0; i < submission.files.length; i++){
			fs.writeFileSync(path + "/" + submission.files[i].name, submission.files[i].contents);
		}

		if (language == "C") {
			console.log("creating C student solution file");
			exec('sh /home/student/ags/grading/createAndGradeStudentExecutableC.sh ' + path+' '+compileFlags, 
				Meteor.bindEnvironment(function(err,stdout,stderr){
					if (stderr) {
						console.log("Compilation error creating execs C: ", stderr);
						Meteor.call('insertSubmissionError', submission.id_Student, assignment._id, submission.subNumber ,stderr);
					} else {
						fs.readFileSync(path + '/compilationworked','utf8',Meteor.bindEnvironment(function(error,data){
							if (error){
								console.log(error);
								//Meteor.call('createErrorJSONFile', {error:'Student C file does not compile'}, path);
							}
						}));
					}
				})
			);
		}
		else if (language == "Java") {
			console.log("creating Java student solution file");
			exec('sh /home/student/ags/grading/createAndGradeStudentExecutableJava.sh ' + path+' '+compileFlags, 
				Meteor.bindEnvironment(function(err,stdout,stderr){
					if (stderr) {
						console.log("Compilation error creating execs Java: ", stderr);
						Meteor.call('insertSubmissionError', submission.id_Student, assignment._id, submission.subNumber ,stderr);
					} else {
						fs.readFileSync(path + '/compilationworked','utf8',Meteor.bindEnvironment(function(error,data){
							if (error){
								console.log(error);
								//Meteor.call('createErrorJSONFile', {error:'Student Java file does not compile'}, path);
							}
						}));
					}

				})
			);
		}
		console.log("sub end");
	},
	'storeSubmissionFeedback' : function(submission, assignment, path){
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var counter = 0;
		var maxTime = assignment.time;
		// check assignment language
		var id_Assignment = assignment._id;
		var assignmentLang = assignment.language;
		var subNumber = submission.subNumber;

		var fileCheck = Meteor.setInterval(function(){
				console.log("Checking for feedback in " + path + " " + counter);
				counter++;

				fs.readFile(path + '/feedback.json', 'utf8', Meteor.bindEnvironment(function(error, data) {
					if (error && counter < maxTime) {
						//console.log(error);
						return;
					}
					else if (counter < maxTime) {
						console.log("Completed");
						try{
							Meteor.call('insertJSONFile',submission.id_Student, id_Assignment, subNumber, path + '/feedback.json',
								function(error){
									if(error) console.log("insert error:", error);
							});
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
		console.log("gradeCleanUp");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		if (path)
			exec("rm -Rf " + path);

	}
});