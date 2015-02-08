(function(){Template.mainContent.helpers({
	'userCourseList': function(){
		return AGSCourses.find({}, {sort: {number: 1, name: 1} });
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find().count() == 0);
	}
});

Template.mainContent.events({
	'submit': function(event){
		event.preventDefault();
		var courseTitle = event.target.courseTitleField.value;
		var courseNumber = event.target.courseNumberField.value;
		var courseSemester = event.target.courseSemesterField.value;
		var courseYear = event.target.courseYearField.value;
		Meteor.call('insertCourseData', courseTitle, courseNumber, courseSemester, courseYear);
	}
})

})();
