Template.mainNav.helpers({
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'courseInfo': function(){
		return Session.get('currentCourse');
	},
	'studentCourseList': function(){
		var courseIdList = AGSUsers.findOne({_id:Meteor.userId()}).id_Courses;
		return AGSCourses.find(({_id : { $in: courseIdList}}), {sort: {number: 1, name: 1} });
	},
	'instructorCourseList' : function(){
		return AGSCourses.find({id_Instructor: Meteor.userId()});
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
	},
	'click #gradeTest': function(){
		Meteor.call('gradeSubmission', Session.get('currentSubmission'), '/home/student/ags/Docker/CompileTestJava/');
	}
})