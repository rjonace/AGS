Template.mainContent.helpers({
	'userCourseList': function(){
		return AGSCourses.find({}, {sort: {number: 1, name: 1} });
	}	
})