/*	Server side Auto Grading methods*/
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
	'writeSubmissionFiles' : function(submission, path) {
		console.log("sub start");
		
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;
		var newPath = path + "/SubmissionFiles";
		console.log("sub check 1");
		fs.mkdirSync(newPath);
		console.log("sub check 2");
		for (var i = 0; i < submission.files.length; i++){
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