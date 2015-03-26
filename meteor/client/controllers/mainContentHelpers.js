Template.mainContent.rendered = function(){

};

Template.mainContent.helpers({
	'studentCourseList': function(){
		var courseIdList = AGSUsers.findOne({_id:Meteor.userId()}).id_Courses;
		return AGSCourses.find(({_id : { $in: courseIdList}}), {sort: {number: 1, name: 1} });
	},
	'instructorCourseList' : function(){
		return AGSCourses.find({id_Instructor: Meteor.userId()});
	},
	'getStudentName' : function(id_Student) {
		var student = AGSUsers.find({_id: id_Student});
		return student.firstname + " " + student.lastname;
	},
	// this function will return true if the current user has instructor priveleges
	// for the current dashboard
	'isUserCreator' : function() {
		var curDash = Session.get('currentDashboard');
		if (curDash === "courseDash" || curDash === "assignmentDash") 
			return Session.get('currentCourse').id_Instructor == Meteor.userId();

		if (curDash === "submissionDash") {
			return Session.get('currentSubmission').id_Student == Meteor.userId();
		}
			return true; // we have to change this later
		
		if (curDash == "userDash")
			return true; // we have to change this later

	},
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'courseInfo': function(){
		// check if creator of course
		return Session.get('currentCourse');
	},
	'assignmentInfo': function(){
		// check if creator of assignment
		return Session.get('currentAssignment');
	},
	'submissionInfo': function(){
		// check if creator of submission
		return Session.get('currentSubmission');
	},
	'feedbackStatus' : function(){
		return Session.get('feedbackStatus');
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find({_id:Meteor.userId()}).count() == 0);
	},
	'courseAssignmentList' : function() {
		var courseId = Session.get('currentCourse')._id;
		var assIdList = AGSCourses.findOne({_id:courseId}).id_Assignments;
		if (assIdList==null)
			return [];
		return AGSAssignments.find(({_id : { $in: assIdList}}), {sort: {dateDue: 1, name: 1} });
	},
	// returns all submissions for the current assignment
	'assignmentSubmissionList' : function() {
		var assignmentId = Session.get('currentAssignment')._id;
		return AGSSubmissions.find({id_Assignment: assignmentId});
	},
	// returns all submissions for the current assignment that have been submitted by the current user
	'studentSubmissionList' : function() {
		var assignmentId = Session.get('currentAssignment')._id;
		return AGSSubmissions.find({id_Assignment: assignmentId, id_Student: Meteor.userId()});
	},
	// returns all submissions for the current assignment based on instructor
	'instructorSubmissionList' : function() {
		var assignmentId = Session.get('currentAssignment')._id;
		return AGSSubmissions.find({id_Assignment: assignmentId, id_Instructor: Meteor.userId()});
	},
	'currentDashboard': function(){
		 return Session.get('currentDashboard');
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
	},
	'fileNotSubmitted': function(){
		return Session.get('fileNotSubmitted');
	},
	'fileNotGraded': function(){
		return Session.get('fileNotGraded');
	},
	'submissionFiles': function(){
		var submission = Session.get('currentSubmission');
		return submission.files;
	},
	'submissionFeedback': function(){
		var submission = Session.get('currentSubmission');
		return submission.feedback;
	},
	'submissionFeedbackObject': function(){
		var submission = Session.get('currentSubmission');
		var HTMLString = '<div "ui segment">'
		for(var name in submission.feedbackObj){
			if (name == "header"){
				for (var val in submission.feedbackObj[name]) {
					HTMLString += '<h2>' + submission.feedbackObj[name] + '</h2>'
				}
			}

			if (name == "table-with-header"){
				for (var tabObj in submission.feedbackObj[name]) {
					HTMLString += '<h2>' + submission.feedbackObj[name].header + '</h2>'
					HTMLString += '<table><thead><tr>'
					for (var col in submission.feedbackObj[name].columns){
						HTMLString += '<th>' + col + '</th>';
					}
					HTMLString += '</tr></thead>'
					HTMLString += '<tbody>'
					for (var row in submission.feedbackObj[name].rows){
						HTMLString += '<tr>'
						for (var val in submission.feedbackObj[name].rows[row]) {
							HTMLString += '<td>' + val + '</td>'
						}
						HTMLString += '</tr>'
					}
					HTMLString += '</tbody></table>'
				}
			}
		}
		HTMLString += '</div>'
		return HTMLString;
	}
});