Meteor.subscribe('coursesList');
Meteor.subscribe('availableCourses');
Meteor.subscribe('currentUserInfo');
Meteor.subscribe('userData');
Meteor.subscribe('allAssignments');
Meteor.subscribe('allAssignment');
Meteor.subscribe('submissionData');

Tracker.autorun(function() {
	if(Session.get('manGradedRow')){
	    $('#manGradedRowActions').show();
		console.log('if');
	} else {
	    $('#manGradedRowActions').hide();
		console.log('else');
	}
}, {onError: function(error){ console.log(error); }})


