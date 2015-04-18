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
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/autograder files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/input files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/solution files');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id_Course+'/'+id+'/student files');

		});
	},	
	'insertAssignmentAG': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { ag: { name: filename, contents: contents} } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/autograder files/'+filename,contents);
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
					fs.writeFile('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/solution files/'+filename,contents);
				}
			}
		);
	},
	'createAssignmentSolution': function(id_Course,id_Assignment,lang){
		var path = '/home/student/ags/grading/courses/'+id_Course;
		if (lang == "Java"){
			exec('sh /home/student/ags/grading/createInstructorSolutionJava.sh '+id_Assignment+' '+ path,
				function(error,stdout,stderr){if (error) console.log("There was an error creating instructor solution Java",error)}
			);
		}
		else if (lang == "C"){
/*			exec('sh /home/student/ags/grading/createInstructorSolutionC.sh '+id_Assignment+' '+ path,
				function(error,stdout,stderr){
					if (error) console.log("There was an error creating instructor solution C",error);
					console.log(stdout,stderr);
				}
			);
*/
			exec('cd ' + path + '/' + id_Assignment +'/solution files &&' + 
				'gcc -std=gnu99 -o execi *.c', 
				function(error,stdout,stderr){console.log(error,stdout,stderr)}
			)

		}
	},
	'insertAssignmentStudent': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { studentfiles: { name: filename, contents: contents } } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/students files/'+filename,contents);
			}
		);
	},
	'insertAssignmentInput': function(id_Course,id_Assignment, filename, contents){
		AGSAssignments.update(
			{_id: id_Assignment}, 
			{$addToSet: { inputfiles: { name: filename, contents: contents } } },
			{upsert : false},	//options
			 function(err, result){	//callback
				if (!err) fs.writeFileSync('/home/student/ags/grading/courses/'+id_Course+'/'+id_Assignment+'/input files/'+filename,contents);
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
	}
});