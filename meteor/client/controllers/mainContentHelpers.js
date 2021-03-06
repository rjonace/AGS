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
	'notEmpty' : function(list){
		if (!list) return false;
		else 
			return list.length > 0;
	},
	'feedbackStatus' : function(){
		if (Session.get('feedbackStatus'))
			return Session.get('feedbackStatus');
		else return Session.get('currentSubmission').status;
	},
	'submissionStatus' : function(){
		return Session.get('currentSubmission').status;
	},
	'subStatus' : function( submission ){
		if (submission.status == "created")
			return "Empty"
		if (submission.status == "timed out")
			return "Error"
		if (submission.status == "graded" && submission.feedbackObj["totals"].pointsUngraded <= 0)
			return "Finished: " + submission.feedbackObj["totals"].pointsEarned + " points"
		if (submission.status == "graded" && submission.feedbackObj["totals"].pointsUngraded > 0)
			return "Waiting: " + submission.feedbackObj["totals"].pointsEarned + " points"
	},
	'isGrading' : function( ){
		return Session.get('currentSubmission').status == "grading";
	},
	'isGraded' : function( ){
		return (Session.get('currentSubmission').status == "graded" && 
			Session.get('currentSubmission').feedbackObj["totals"].pointsUngraded <= 0)
	},
	'isError' : function( ){
		return Session.get('currentSubmission').status == "timed out";
	},
	'errorStatus' : function(){
		var status = 'An error has occured!'
		if(Session.get('currentSubmission').status == "timed out")
			status = 'Timed out!';
		return status;
	},
	'isWaitingForGrades' : function( ){
		return (Session.get('currentSubmission').status == "graded" && 
			Session.get('currentSubmission').feedbackObj["totals"].pointsUngraded > 0)
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find({_id:Meteor.userId()}).count() == 0);
	},
	'courseAssignmentList' : function() {
		var courseId = Session.get('currentCourse')._id;
		var assIdList = AGSCourses.findOne({_id:courseId}).id_Assignments;
		if (assIdList==null)
			return [];
		return AGSAssignments.find(({_id : { $in: assIdList}}), {sort: {/*dateDue: 1,*/ name: 1} });
	},
	// returns all submissions for the current assignment
	'assignmentSubmissionList' : function() {
		var assignmentId = Session.get('currentAssignment')._id;
		return AGSSubmissions.find({id_Assignment: assignmentId});
	},
	// returns all submissions for the current assignment that have been submitted by the current user
	'studentSubmissionList' : function() {
		var assignment = Session.get('currentAssignment');
		var assignmentId = assignment ? assignment._id : null;
		return AGSSubmissions.find({id_Assignment: assignmentId, id_Student: Meteor.userId()});
//		var submissions = AGSSubmissions.find({id_Assignment: assignmentId, id_Student: Meteor.userId()});
//		if (submissions.length == 1) return [submissions];
//		else return submissions;
	},
	// returns all submissions for the current assignment based on instructor
	'instructorSubmissionList' : function() {
		var assignment = Session.get('currentAssignment');
		var assignmentId = assignment ? assignment._id : null;
		return AGSSubmissions.find({id_Assignment: assignmentId, id_Instructor: Meteor.userId(), id_Student:{ $ne:Meteor.userId() } });
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
	'manGradedRow' : function(){
		return Session.get('manGradedRow');
	},
	'submissionFeedbackObject': function(){
		var submission = Session.get('currentSubmission');
		var HTMLString = '<div "ui segment">'

		if (!submission.feedbackObj) {
			HTMLString += '<h3>No feedback available</h3>'
		} else if (submission.feedbackObj.error){
			HTMLString += '<h3>Error</h3>';
			HTMLString += '<pre>'+ submission.feedbackObj.error.stderr +'</pre>';
			HTMLString += '<pre>'+ submission.feedbackObj.error.stdout +'</pre>';
		}
		else{
			var totals = submission.feedbackObj['totals'];
			
			HTMLString += '<div align="right">';

			HTMLString += '<h4>Total Points Earned: ';
			HTMLString += totals.pointsEarned+' out of '+totals.pointsGraded;
			if (totals.pointsUngraded > 0)
				HTMLString += ' graded';
			HTMLString += '</h4>';
			if (totals.pointsUngraded > 0) {
				HTMLString += '<h4>Total Points Ungraded: ';
				HTMLString += totals.pointsUngraded;
				HTMLString += '  points left</h4>';

				HTMLString += '<h4>Max Possible Score: ';
				HTMLString += totals.pointsMaxStillPossible+' out of '+totals.pointsTotalAssignment;
				HTMLString += ' possible</h4>';
			}

			HTMLString += '</div>'
			
			for(var name in submission.feedbackObj){
				if (name == "sections"){
					for (var i in submission.feedbackObj[name]) {
						var tabObj = submission.feedbackObj[name][i];
						
						HTMLString += '<h4>' + tabObj["sectionName"];
						HTMLString += ' (' + tabObj["pointsPossible"];
						HTMLString += '  points possible)</h4>'

						HTMLString += '<table class="ui celled table"><thead><tr>'
							
						HTMLString += '<th>Description</th><th>Points Earned</th><th>Points Possible</th><th>Comments</th>';
						HTMLString += '</tr></thead>'
						HTMLString += '<tbody>'
						for (var rowObj in tabObj["rows"]){
							HTMLString += '<tr>'
							for (var val in tabObj["rows"][rowObj]) {
								if (tabObj["rows"][rowObj][val] < 0){
									if(Session.get('currentCourse').id_Instructor == Meteor.userId())
										HTMLString += '<td><div rowIndex="'+ rowObj + '" tableIndex="'+i+'" class="ui fluid manual row button">Grade</div></td>'
									else
										HTMLString += '<td>Waiting for TA</td>'
								}
								else
									HTMLString += '<td>' + tabObj["rows"][rowObj][val] + '</td>'
							}
							HTMLString += '</tr>'
						}
						for (var r in tabObj["gradedInputs"]){
							HTMLString += '<tr class="gradedInputRow" index='+r+'>'
							HTMLString += '<td>' + tabObj["gradedInputs"][r].name + '</td>'
							HTMLString += '<td>' + tabObj["gradedInputs"][r].pointsEarned + '</td>'
							HTMLString += '<td>' + tabObj["gradedInputs"][r].pointsPossible + '</td>'
							HTMLString += '<td>' + tabObj["gradedInputs"][r].comments + '<div class="ui right floated mini compact icon button"><i class="dropdown icon"></i></div></td>'
							HTMLString += '</tr>'
							HTMLString += '<tr><td colspan="4" style="display: none;"><table class="ui celled table"><thead><tr><th>test case #</th><th>correct output</th><th>student output</th><th>points</th><th>comments</th></tr></thead><tbody>'
							for (var caseIndex in tabObj["gradedInputs"][r].cases){
								if (!tabObj["gradedInputs"][r].cases[caseIndex].correct)
									HTMLString += '<tr class="error">'
								else
									HTMLString += '<tr>'
								HTMLString += '<td>' + (Number(caseIndex) + 1) + '</td>'
								HTMLString += '<td>' + tabObj["gradedInputs"][r].cases[caseIndex].correctOutput + '</td>'
								HTMLString += '<td>' + tabObj["gradedInputs"][r].cases[caseIndex].studentOutput + '</td>'
								HTMLString += '<td>' + tabObj["gradedInputs"][r].cases[caseIndex].points + '</td>'
								HTMLString += '<td>' + tabObj["gradedInputs"][r].cases[caseIndex].comments + '</td>'
								HTMLString += '</td></tr>'
							}
							HTMLString += '</tbody></table></tr>'
						}
						HTMLString += '</tbody></table>'
					}
				}
			}
		}
		HTMLString += '</div>'

		return HTMLString;
	}
});