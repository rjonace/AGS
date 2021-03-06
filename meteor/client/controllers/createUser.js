Template.AGSCreateUser.helpers({
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find({_id:Meteor.userId()}).count() == 0);
	}
});

Template.AGSCreateUser.events({
	'submit .createUser': function(event){

		var userId = Meteor.userId();
		var firstName = event.target.firstNameField.value;
		var lastName = event.target.lastNameField.value;
		var availableCourseList = event.target.userCourse;
		var selectedCourseList = [];

		if (firstName === "" || lastName === "") {
			$('.ui.error.message').text('Enter first and last name').show();
			return false;
		} 
		
		if(availableCourseList) {
			if(!availableCourseList.length){
				if(availableCourseList.checked){
					selectedCourseList.push(availableCourseList.value);
				}
			}

			for( i=0; availableCourseList && i < availableCourseList.length; i++) {
				if (availableCourseList[i].checked) {
					selectedCourseList.push(availableCourseList[i].value);
				}
			}
		}
		Meteor.call('createUserData',userId,firstName,lastName,selectedCourseList);
	}
})