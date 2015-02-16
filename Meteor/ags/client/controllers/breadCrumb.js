Template.breadCrumb.helpers({
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'courseInfo': function(){
		return Session.get('currentCourse');
	},
	'assignmentInfo': function(){
		return Session.get('currentAssignment');
	},
	'submissionInfo': function(){
		return Session.get('currentSubmission');
	},
	'isUserDash': function(){
		return Session.get('currentDashboard') === "userDash";
	},
	'isCourseDash': function(){
		return Session.get('currentDashboard') === "courseDash";
	},
	'isAssignmentDash': function(){
		return Session.get('currentDashboard') === "assignmentDash";
	},
	'isSubmissionDash': function(){
		return Session.get('currentDashboard') === "submissionDash";
	}
});


Template.breadCrumb.events({
	'click #breadUser': function(){
		Session.set('currentCourse', null);
		Session.set('currentAssignment', null);
		Session.set('currentSubmission', null);
		Session.set('currentDashboard', "userDash");
	},
	'click #breadCourse': function(){
		Session.set('currentCourse', this);
		Session.set('currentAssignment', null);
		Session.set('currentSubmission', null);
		Session.set('currentDashboard', "courseDash");
	},
	'click #breadAss': function(){
		Session.set('currentAssignment', this);
		Session.set('currentSubmission', null);
		Session.set('currentDashboard', "assignmentDash");
	},
	'click #breadSub': function(){
		Session.set('currentSubmission', this);
		Session.set('currentDashboard', "submissionDash");
	}
})