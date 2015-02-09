Meteor.methods({
	'createUserData': function(id, first, last, id_Courses){
		AGSUsers.insert({
			_id: id,
			firstname: first,
			lastname: last,
			id_Courses: id_Courses
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
	'insertAssignmentData': function(id_Course, name, description, dateAvailable, dateDue, points, vta, solution, input){
		
		var fileReader = new FileReader();
		fileReader.readAsText(vta);
		while(fileReader.readyState != fileReader.DONE);
		var vtaObj = {name: vta.name, contents:fileReader.result};

		fileReader.readAsText(solution);
		while(fileReader.readyState != fileReader.DONE);
		var solutionObj = {name: solution.name, contents:fileReader.result};

		var inputObjList = [];
		for(var i=0; i < input.length; i++) {
			var curInput = input.files[i];
			fileReader.readAsText(curInput);
			while(fileReader.readyState != fileReader.DONE);
			inputObjList.push({name: curInput.name, contents:fileReader.result});
		}


		AGSAssignments.insert({
			name: name,
			description: description,
			dateAvailable: dateAvailable,
			dateDue: dateDue,
			points: points,
			vta: vtaObj,
			solution: solutionObj,
			input: inputObjList,
			id_Course: id_Course
		}, function(err, id) {
			console.log(err);
			AGSCourses.update(
				{_id:id_Course},
				{ $addToSet: { id_Assignments: id}}
			);
		});
	}
})