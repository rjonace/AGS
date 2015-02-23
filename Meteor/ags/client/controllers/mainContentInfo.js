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
	'submissionFeeback': function(){
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
	'click .userCourse': function(){
		Session.set('currentCourse', this);
		Session.set('currentDashboard', "courseDash");
	},
	'click .courseAssignment': function(){
		Session.set('currentAssignment', this);
		Session.set('currentDashboard', "assignmentDash");
	},
	'click .assignmentSubmission': function(){
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


/*		Meteor.call('prepareGrade', currentUserId, currentAssignment._id, submission, filePath,
				function( error, result ) {
					if(!error) {
						Meteor.call('writeSubmissionFiles', submission, filePath + "/" + result,
							function(error1) {
								Meteor.call('writeInstructorFiles', currentAssignment, filePath + "/" + result,
									function(error2) {
										Meteor.call('gradeSubmission', submission, filePath, result, currentUserId, currentAssignment._id,
											function(error3) {
												Meteor.call('gradeCleanUp', filePath, result);
											}
										)
									}
								)
							}
						)
					}
				}
		);*/

		var folderName = Meteor.apply('prepareGrade', [currentUserId, currentAssignment._id, submission, filePath],true);
		Meteor.apply('writeSubmissionFiles', [submission, filePath + "/" + folderName] , true);
		Meteor.apply('writeInstructorFiles', [currentAssignment, filePath + "/" + folderName], true);
		Meteor.apply('gradeSubmission', [submission, filePath, folderName, currentUserId, currentAssignment._id] , true);
		//Meteor.apply('gradeCleanUp', [filePath, folderName], true);
		Session.set('fileNotGraded', false);

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
						Meteor.call('insertSubmissionSolution', currentUserId, currentAssignmentId,
							 currentSubmissionNumber, name, reader.result);
					}
					reader.readAsText(file);
				})(fileList[i]);
			};
		}
		Session.set('file');
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
	}
})