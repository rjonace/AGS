Template.mainContent.helpers({
	'userCourseList': function(){
		var courseIdList = AGSUsers.findOne({_id:Meteor.userId()}).id_Courses;
		return AGSCourses.find(({_id : { $in: courseIdList}}), {sort: {number: 1, name: 1} });
	},
	'userInfo': function(){
		return AGSUsers.findOne();
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find().count() == 0);
	},
	'currentDashboard': function(){
		 return Session.get('currentDashboard');
	},
	'isUserDash': function(){
		return Session.get('currentDashboard') === "userDash";
	},
	'isCourseDash': function(){
		return Session.get('currentDashboard') === "courseDash";
	}
});

Template.mainContent.events({
	'submit': function(event){
/*		event.preventDefault();
		var courseTitle = event.target.courseTitleField.value;
		var courseNumber = event.target.courseNumberField.value;
		var courseSemester = event.target.courseSemesterField.value;
		var courseYear = event.target.courseYearField.value;
		Meteor.call('insertCourseData', courseTitle, courseNumber, courseSemester, courseYear);
	*/
	},
	'click .userCourse': function(){
		Session.set('currentCourse', this)
		Session.set('currentDashboard', "courseDash");
	}
})