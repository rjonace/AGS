Template.AGSCreateUser.helpers({
	'courseList': function(){
		return AGSCourses.find();
	}
});

Template.AGSCreateUser.events({
	'submit': function(event){
		var userId = Meteor.userId();
		var firstName = event.target.firstNameField.value;
		var lastName = event.target.lastNameField.value;
		var selectedCourseList = event.target.userCourse;
		console.log(selectedCourseList);
		Meteor.call('createUserData',userId,firstName,lastName,selectedCourseList);
	}
})