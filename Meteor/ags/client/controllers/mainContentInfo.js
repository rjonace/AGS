Template.mainContent.rendered = function(){
	//$('.dashboard.popup.tips .ui.button').popup();
};

Template.addCourseForm.helpers({
	'isCourseDash': function(){
		return Session.get('currentDashboard') === "courseDash";
	},
	'courseInfo': function(){
		// check if creator of course
		return Session.get('currentCourse');
	}
});

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

		if (curDash === "submissionDash")
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
	'submissionFilename': function(){
		var submission = Session.get('currentSubmission');
		return submission.filename;
	},
	'submissionFeedback': function(){
		var submission = Session.get('currentSubmission');
		return submission.feedback;
	}
});

Template.mainContent.events({
	'submit #createCourse': function(event){
		event.preventDefault();
		var courseTitle = event.target.courseNameField.value;
		var courseNumber = event.target.courseNumberField.value;
		var courseSemester = event.target.courseSemesterField.value;
		var courseYear = event.target.courseYearField.value;
		Meteor.call('insertCourseData', courseTitle, courseNumber, courseSemester, courseYear);
	},
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
	},
	'click #userCourse': function(){
		Session.set('currentCourse', this);
		Session.set('currentDashboard', "courseDash");
	},
	'click #courseAssignment': function(){
		Session.set('currentAssignment', this);
		Session.set('currentDashboard', "assignmentDash");
	},
	'click #assignmentSubmission': function(){
		Session.set('currentSubmission', this);
		Session.set('currentDashboard', "submissionDash");
		if(Session.get('currentSubmission').filename === undefined){
			Session.set('fileNotSubmitted', true);
		}else{
			Session.set('fileNotSubmitted', false);
		}
		if(Session.get('currentSubmission').feedback === undefined){
			Session.set('fileNotGraded', true);
		}else{
			Session.set('fileNotGraded', false);
		}
	},
	'click #write': function(){
/*		var errString;
		alert(Meteor.call('writeFiles', Session.get('currentAssignment'), '/home/student/ags/gradeTest'));
		console.log(errString);*/
	},
	'click #gradeSubmission': function(){
		var submission = Session.get('currentSubmission');
		var currentUserId = Meteor.userId();
		var currentAssignment = Session.get('currentAssignment');
		var filePath = '/home/student/ags/gradeTest';
		var counter = 0;
		var maxTime = 50;
		var newPath;
		
		Meteor.call('prepareGrade', currentUserId, currentAssignment._id, submission, filePath,
			function(error, result) {
				var folderName = result;
				newPath = filePath + "/" + folderName;
				Meteor.apply('writeSubmissionFiles', [submission, filePath + "/" + folderName] , true);
				Meteor.apply('writeInstructorFiles', [currentAssignment, filePath + "/" + folderName], true);
				Meteor.apply('gradeSubmission', [submission, filePath, folderName, currentUserId, currentAssignment._id, currentAssignment.language], true);
				Session.set('fileNotGraded', false);
		});

		var feedbackCheck = Meteor.setInterval(function(){
			Session.set('feedbackStatus',"Checking for feedback " + counter);
			counter++;
			

			Meteor.call('resetSubmissionSession', currentUserId, currentAssignment._id, submission, 
				function(error, result) {
					if (!result.feedback && counter < maxTime) {
						return;
					} else if (counter < maxTime) {
						Session.set('currentSubmission', result);
						Session.set('feedbackStatus', "Submission graded.");
						Meteor.apply('gradeCleanUp', [newPath, currentUserId, currentAssignment._id, submission], true);
					} else {
						Session.set('feedbackStatus', "Timed out");
					}

					Meteor.clearInterval(feedbackCheck);
			});
		}, 1000);

	},
	'submit #submissionFilesForm': function(event){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var currentAssignmentId = Session.get('currentAssignment')._id;
		var currentSubmission = Session.get('currentSubmission');
		var currentSubmissionNumber = currentSubmission.subNumber;

		var reader = new FileReader();
		var fileList = event.target.submissionSolutionFile.files;
		if(fileList.length > 0) {
			for (var i = 0; i < fileList.length; i++) {
				(function(file) {
					var name = file.name;
					var reader = new FileReader();
					reader.onloadend = function(event) {
						Meteor.call('insertSubmissionSolution', currentUserId, currentAssignmentId, currentSubmissionNumber, name, reader.result,
							function(error, result) {
								Session.set('currentSubmission', result.AttemptList[currentSubmissionNumber]);
							}
						);
					}
					reader.readAsText(file);
				})(fileList[i]);
			};
		}
		Session.set('fileNotSubmitted', false);
	},
	'submit #createAssignment': function(event){
		event.preventDefault();
		var name = event.target.assignmentNameField.value;
		var description = event.target.assignmentDescriptionField.value;
		var lang = event.target.assignmentLanguageField.value;
		var dateAvailable = event.target.assignmentDateAvailableField.value;
		var dateDue = event.target.assignmentDateDueField.value;
		var points = event.target.assignmentPointsField.value;

		var currentCourseId = Session.get('currentCourse')._id;
		Meteor.call('insertAssignmentData', currentCourseId, name, description, lang, dateAvailable, dateDue, points, 
			function(error, result) {
				if(!error) {

					var agReader = new FileReader();
//					var solutionReader = new FileReader();
					var studentReader = new FileReader();

					var ag = event.target.assignmentAGField.files[0];
//					var solution = event.target.assignmentSolutionField.files[0];
					var studentFileList = event.target.assignmentStudentField.files;

					var agObj
//						solutionObj;

					agReader.onloadend = function(){
						agObj = {name: ag.name, contents:agReader.result};
						Meteor.call('insertAssignmentAG', result, agObj.name, agObj.contents);
					}

/*					solutionReader.onloadend = function(){
						solutionObj = {name: solution.name, contents:solutionReader.result};
						Meteor.call('insertAssignmentSolution', result, solutionObj.name, solutionObj.contents);
					}
*/
					if (ag)
						agReader.readAsText(ag);

//					if (solution)
//						solutionReader.readAsText(solution);

					if(studentFileList.length > 0) {
						for (var i = 0; i < studentFileList.length; i++) {
							(function(file) {
								var name = file.name;
								var reader = new FileReader();
								reader.onloadend = function(event) {
									Meteor.call('insertAssignmentStudent', result, name, reader.result);
								}
								reader.readAsText(file);
							})(studentFileList[i]);
						};
					}


				} else {
					console.log(error);
				}
			}
		);
	},
	'click #newSubmission': function(){

		Meteor.call('createNewSubmission', Meteor.userId(), Session.get('currentAssignment')._id, Session.get('currentCourse').id_Instructor, 
			function( error, result ) {
				if(!error) {
					var currentSubmission = result.AttemptList[result.AttemptCount-1];
					Session.set('currentSubmission', currentSubmission);
					Session.set('currentDashboard', "submissionDash");
				}
			}
		);
		Session.set('fileNotSubmitted', true);
		Session.set('fileNotGraded', true);
	},
	'click .ui.teal.enroll.button' : function(event) {
		var keyEntered = $('#courseKeyField').val();
		if (keyEntered === "") {
			$('.ui.message.enroll').text('Please enter a valid Course key').show();
			return;
		}

		Meteor.call('checkCourseKey', keyEntered, 
			function(error, result) {
				if(!error && result) {
					$('.ui.message.enroll').text("You have enrolled in " + result.name).show();
					Meteor.call('enrollInCourse',result);
				}
				else if (error)
					$('.ui.message.enroll').text(error).show();
				else
					$('.ui.message.enroll').text('Invalid Course key').show();
			});
	},
/*	'click #createCourseTitle' : function(){
		$('#courseAccordion').accordion('toggle',0);
		console.log('course title clicked');
	},
	'click #createAssignmentTitle' : function(){
		$('#assignmentAccordion').accordion('toggle',0);
	},*/
	'mouseenter .ui.icon.edit.button' : function(){
		$('.dashboard.popup.tips .ui.icon.edit.button').popup('show');
	},
	'mouseenter .ui.icon.delete.button' : function(){
		$('.dashboard.popup.tips .ui.icon.delete.button').popup('show');
	},
	'click .ui.icon.edit.button' : function(){
		$('#editModal').modal('show');
	},
	'click .ui.icon.delete.button' : function(){
		$('#deleteModal').modal('show');
	}

})