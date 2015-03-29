Template.addCourseForm.helpers({
	'isCourseDash': function(){
		return Session.get('currentDashboard') === "courseDash";
	},
	'courseInfo': function(){
		// check if creator of course
		return Session.get('currentCourse');
	}
});