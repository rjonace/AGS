Template.mainNav.helpers({
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'courseInfo': function(){
		return Session.get('currentCourse');
	},
	'assignmentInfo': function(){
		return Session.get('currentAssignment');
	},
	'isUserDash': function(){
		return Session.get('currentDashboard') === "userDash";
	},
	'isCourseDash': function(){
		return Session.get('currentDashboard') === "courseDash";
	},
	'isAssignmentDash': function(){
		return Session.get('currentDashboard') === "assignmentDash";
	}
});


Template.mainNav.events({
	'click #navUser': function(){
		Session.set('currentCourse', null);
		Session.set('currentAssignment', null);
		Session.set('currentDashboard', "userDash");
	},
	'click #navCourse': function(){
		Session.set('currentCourse', this);
		Session.set('currentAssignment', null);
		Session.set('currentDashboard', "courseDash");
	},
	'click #navAss': function(){
		Session.set('currentAssignment', this);
		Session.set('currentDashboard', "assignmentDash");
	}
})