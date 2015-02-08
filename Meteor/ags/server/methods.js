Meteor.methods({
	'createUserData': function(id, first, last, id_Courses){
		AGSUsers.insert({
			_id: id,
			first: first,
			last: last,
			id_Courses: id_Courses
		});
	},
	'insertCourseData': function(title, number, semester, year) {
		var currentUserId = Meteor.userId();
		AGSCourses.insert({
			title: title,
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
	}
})