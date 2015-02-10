(function(){Meteor.methods({
	'writeFiles' : function(assignment, path) {
		var fs = Npm.require('fs');
		var exec = Npm.require('child_process').exec;

		//make studentfiles directory
		exec("mkdir " + path + "/InstructorFiles"
			 ,function(error, stdout, stderr){
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
	'insertAssignmentData': function(id_Course, name, description, dateAvailable, dateDue, points){

		return AGSAssignments.insert({
			name: name,
			description: description,
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

})();
