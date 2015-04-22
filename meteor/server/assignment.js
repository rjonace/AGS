/*	Server side Assignment Methods*/
var fs = Npm.require('fs');
var exec = Npm.require('child_process').exec;
Meteor.methods({
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

			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id);
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/autograder_files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/input_files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/solution_files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/student_files');

		});
	},	
	'insertAssignmentAG': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { ag: { name: filename, contents: contents} } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/autograder_files/'+filename,contents);
			}
		);
	},	
	'insertAssignmentSolution': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { solution: { name: filename, contents: contents} } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) {
					fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/solution_files/'+filename,contents);
				}
			}
		);
	},
	'createAssignmentSolution': function(id_Course,id_Assignment,lang){
		var path = '/home/student/ags/grading/courses/'+id_Course;
		if (lang == "Java"){
			console.log("creating Java instructor solution file");
			exec('sh /home/student/ags/grading/createInstructorSolutionJava.sh '+id_Assignment+' '+ path,
				function(error,stdout,stderr){
					if (error) console.log("createInstructorSolutionJava error: " + error);
					if (stdout) console.log("createInstructorSolutionJava stdout: " + stdout);
					if (stderr) console.log("createInstructorSolutionJava stderr: " + stderr);
				}
			);
		}
		else if (lang == "C"){
			console.log("creating C instructor solution file");
			exec('sh /home/student/ags/grading/createInstructorSolutionC.sh '+id_Assignment+' '+ path,
				function(error,stdout,stderr){
					if (error) console.log("createInstructorSolutionC error: " + error);
					if (stdout) console.log("createInstructorSolutionC stdout: " + stdout);
					if (stderr) console.log("createInstructorSolutionC stderr: " + stderr);
				}
			);
		}
	},	
	'createAutograderNonskeleton': function(id_Course,id_Assignment){
		var path = '/home/student/ags/grading/courses/'+id_Course;
		exec('sh /home/student/ags/grading/createAutograderAPIversion.sh '+id_Assignment+' '+ path +
			' /home/student/ags/vta/bin',
			function(error,stdout,stderr){
			//		if (error) console.log("createAutograder error: " + error);
			//		if (stdout) console.log("createAutograder stdout: " + stdout);
					if (stderr) console.log("createAutograder stderr: " + stderr);
				}
		);
	},
	'insertAssignmentStudent': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { studentfiles: { name: filename, contents: contents } } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/student_files/'+filename,contents);
			}
		);
	},
	'insertAssignmentInput': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { inputfiles: { name: filename, contents: contents } } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/input_files/'+filename,contents);
			}
		);
	},
	'updateAssignmentData' : function(id_Assignment, name, description, lang, dateAvailable, dateDue, time, points,type){
		AGSAssignments.update(
		{_id:id_Assignment},
		{ $set: {
			name: name,
			description: description,
			language: lang,
			dateAvailable: dateAvailable,
			dateDue: dateDue,
			time: time,
			points: points,
			type: type
		}},{upsert : false},	//options
		 function(err, result){	//callback
			if (err)
				console.log(err);
		});
	},
	'removeAssignmentData': function(id_Assignment, id_Course){
		AGSAssignments.remove({_id:id_Assignment});
		AGSCourses.update(
			{},
			{ $pull : 
				{id_Assignments: id_Assignment}
			},
			{ multi:true });
		AGSSubmissions.remove({id_Assignment:id_Assignment});

		var exec = Npm.require( 'child_process' ).exec;
		if (id_Course && id_Assignment){
			var path = '/home/student/ags/grading/courses/' +id_Course + '/' + id_Assignment;
			exec( 'rm -r ' + path, function ( err, stdout, stderr ){
			  if (!err) console.log("assignment removed!");
			  else console.log(err);
			});
		};
		// remove all references to the assignemnt?
	},
	'resetCurrentAssignment' : function(id_Assignment){
		return AGSAssignments.findOne({_id:id_Assignment});
	}
});