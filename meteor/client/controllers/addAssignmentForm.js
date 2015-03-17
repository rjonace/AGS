Template.addAssignmentForm.helpers({
	'isAssignmentDash': function(){
		return Session.get('currentDashboard') === "assignmentDash";
	},
	'assignmentInfo': function(){
		// check if creator of course
		return Session.get('currentAssignment');
	}
});
