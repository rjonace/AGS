Template.AGSCreateUser.helpers({
	'courseList': function(){
		return AGSCourses.find().fetch();
	},
	'addIndex': function (all) {
		var retVals = [];
		var i = 0;
		for (item in all) {
			retVals.push({index: i, value: all[i] });
			i++;
		}
		return retVals;
	}
});

Template.AGSCreateUser.events({
	'submit #createUser': function(event){

		var userId = Meteor.userId();
		var firstName = event.target.firstNameField.value;
		var lastName = event.target.lastNameField.value;
		var availableCourseList = event.target.userCourse;
		var selectedCourseList = [];

		for( i=0; availableCourseList && i < availableCourseList.length; i++) {
			if (availableCourseList[i].checked) {
				selectedCourseList.push(availableCourseList[i].value);
			}
		}
		console.log(selectedCourseList);
		Meteor.call('createUserData',userId,firstName,lastName,selectedCourseList);
	}
})