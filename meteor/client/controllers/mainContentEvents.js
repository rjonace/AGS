Template.mainContent.events({
	'submit #createCourse': function(event){
		event.preventDefault();
		var courseTitle = event.target.courseNameField.value;
		var courseNumber = event.target.courseNumberField.value;
		var courseSemester = event.target.courseSemesterField.value;
		var courseYear = event.target.courseYearField.value;
		var courseDescription = event.target.courseDescriptionField.value;

		if (courseTitle === "" || courseNumber === "" || courseSemester === "" || courseYear === "") {
			$('#courseErrorMessage').text('Complete required fields').show();
			return false;
		}

		Meteor.call('insertCourseData', courseTitle, courseNumber, courseSemester, courseYear, courseDescription);
	},
	'submit .createUser': function(event){

		var userId = Meteor.userId();
		var firstName = event.target.firstNameField.value;
		var lastName = event.target.lastNameField.value;
		var availableCourseList = event.target.userCourse;
		var selectedCourseList = [];

		if (firstName === "" || lastName === "") {
			$('#userErrorMessage').text('Enter first and last name').show();
			return false;
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
		if(Session.get('currentSubmission').files === undefined){
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
	'click #gradeSubmission': function(){
		var submission = Session.get('currentSubmission');
		var currentUserId = Meteor.userId();
		var currentAssignment = Session.get('currentAssignment');
		var filePath = '/home/student/ags/grading';
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
			Session.set('fileNotSubmitted', false);
		} else {
			$('#submissionErrorMessage').text('No solution file chosen.').show();
			return false;
		}

	},
	'submit #createAssignment': function(event){
		event.preventDefault();
		var name = event.target.assignmentNameField.value;
		var description = event.target.assignmentDescriptionField.value;
		var lang = event.target.assignmentLanguageField.value;
		var dateAvailable = event.target.assignmentDateAvailableField.value;
		var dateDue = event.target.assignmentDateDueField.value;
		var time = event.target.assignmentTimeField.value;
		var points = event.target.assignmentPointsField.value;

		if (name === "" || lang === "" || dateAvailable === "" || dateDue === "" || time === "") {
			$('#assignmentErrorMessage').text('Complete required data fields').show();
			return false;
		} else {
			if (event.target.assignmentAGField.files.length == 0) {
				$('#assignmentErrorMessage').text('Choose Auto-Grader File.').show();
				return false;
			}
			if (event.target.assignmentStudentField.files.length == 0) {
				$('#assignmentErrorMessage').text('Choose Student File(s).').show();
				return false;
			}
		}

		var currentCourseId = Session.get('currentCourse')._id;
		Meteor.call('insertAssignmentData', currentCourseId, name, description, lang, dateAvailable, dateDue, time, points, 
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
		$('#userErrorMessage').hide();
		$('#courseErrorMessage').hide();
		$('#assignmentErrorMessage').hide();
		$('#editModal').modal({
			closable : false,
			onDeny: function(){
				if(Session.get('currentDashboard') === "userDash"){
					var currentUser = AGSUsers.findOne({_id:Meteor.userId()});
					
					 $('#firstNameField').val(currentUser.firstname)
					 $('#lastNameField').val(currentUser.lastname)
				}
				if(Session.get('currentDashboard') === "courseDash"){
					var currentCourse = Session.get('currentCourse');

					 $('#courseNameField').val(currentCourse.name)
					 $('#courseNumberField').val(currentCourse.number)
					 $('#courseSemesterField').val(currentCourse.semester)
					 $('#courseYearField').val(currentCourse.year)
					 $('#courseDescriptionField').val(currentCourse.description)

				}
				if(Session.get('currentDashboard') === "assignmentDash"){
					var currentAssignment = Session.get('currentAssignment');

					 $('#assignmentNameField').val(currentAssignment.name)
					 $('#assignmentDescriptionField').val(currentAssignment.description)
					 $('#assignmentLanguageField').val(currentAssignment.language)
					 $('#assignmentDateAvailableField').val(currentAssignment.dateAvailable)
					 $('#assignmentDateDueField').val(currentAssignment.dateDue)
					 $('#assignmentPointsField').val(currentAssignment.points)

				}
			},
			onApprove : function(event){
				if(Session.get('currentDashboard') === "userDash"){
					var currentUser = AGSUsers.findOne({_id:Meteor.userId()});
					
					var firstName = $('#firstNameField').val();
					var lastName = $('#lastNameField').val();

					if (firstName === "" || lastName === "") {
						$('#userErrorMessage').text('Enter first and last name').show();
						return false;
					} 

					Meteor.call('createUserData',
					 currentUser._id, 
					 firstName, 
					 lastName, 
					 currentUser.id_Courses);
				}
				if(Session.get('currentDashboard') === "courseDash"){
					var currentCourse = Session.get('currentCourse');

					var name = $('#courseNameField').val();
					var number = $('#courseNumberField').val();
					var semester = $('#courseSemesterField').val();
					var year = $('#courseYearField').val();
					var description = $('#courseDescriptionField').val();

					if (name === "" || number === "" || semester === "" || year === "") {
						$('#courseErrorMessage').text('Complete required fields').show();
						return false;
					}

					Meteor.apply('updateCourseData',
					 [currentCourse._id, 
					 name, 
					 number,
					 semester, 
					 year,  
					 description]);
					Meteor.apply('resetCurrentCourse',[currentCourse._id], 					 
				 		function(error,result){
				 			if(!error){
				 				Session.set('currentCourse',result);
				 			}
				 			else
				 				console.log(error);
				 		}
					);

				}
				if(Session.get('currentDashboard') === "assignmentDash"){
					var currentAssignment = Session.get('currentAssignment');

					 var name = $('#assignmentNameField').val();
					 var description = $('#assignmentDescriptionField').val();
					 var lang = $('#assignmentLanguageField').val();
					 var dateAvailable = $('#assignmentDateAvailableField').val();
					 var dateDue = $('#assignmentDateDueField').val();
					 var time = $('#assignmentTimeField').val();
					 var points = $('#assignmentPointsField').val();

			 		if (name === "" || lang === "" || dateAvailable === "" || dateDue === "" || time === "") {
						$('#assignmentErrorMessage').text('Complete required data fields').show();
						return false;
					}

					Meteor.apply('updateAssignmentData',
						[currentAssignment._id,
						 name,
						 description,
						 lang,
						 dateAvailable, 
						 dateDue,
						 time, 
						 points]);
					Meteor.apply('resetCurrentAssignment',[currentAssignment._id], 					 
				 		function(error,result){
				 			if(!error){
				 				Session.set('currentAssignment',result);
				 			}
				 			else
				 				console.log(error);
				 		}
					);
				}
			}
	}).modal('show');
	},
	'click .ui.icon.delete.button' : function(){
		$('#deleteModal').modal({
			closable:false,
			onDeny : function(){

			},
			onApprove : function(){
				if(Session.get('currentDashboard') === "courseDash"){
					var currentCourse = Session.get('currentCourse');
					Meteor.call('removeCourseData',currentCourse._id);
					Session.set('currentCourse', null);
					Session.set('currentDashboard', "userDash");
				}
				if(Session.get('currentDashboard') === "assignmentDash"){
					var currentAssignment = Session.get('currentAssignment');
					Meteor.call('removeAssignmentData',currentAssignment._id);
					Session.set('currentAssignment', null);
					Session.set('currentDashboard', "courseDash");
				}
			}
		}).modal('show');
	},
	'click #viewFilesButton' : function(){
		$('#viewFilesModal').modal('show');
	},
	'change #submissionSolutionFile' : function(event) {
		var fileName = $('#submissionSolutionFile').val();
		if (fileName != '')
			$('#subFileNameField').val(fileName);
		else
			$('#subFileNameField').val('No file chosen')
	},
	'change #assignmentAGField' : function(event) {
		var fileName = $('#assignmentAGField').val();
		console.log(fileName);
		if (fileName != '')
			$('#agFileNameField').val(fileName);
		else
			$('#agFileNameField').val('No file chosen')
	},
	'change #assignmentStudentField' : function(event) {
		var fileName = $('#assignmentStudentField').val();
		console.log(fileName);
		if (fileName != '')
			$('#studentFileNameField').val(fileName);
		else
			$('#studentFileNameField').val('No file chosen')
	},
	'click .gradedInputRow' : function(event) {
		var curIndex = Number($(event.currentTarget)[0].getAttribute('index'));
		var displayMode = $($(event.currentTarget)[0].parentElement.children[2*curIndex+1].children[0]).css('display');
		if (displayMode == 'none')
			$($(event.currentTarget)[0].parentElement.children[2*curIndex+1].children[0]).css('display','table-cell');
		else if (displayMode == 'table-cell')
			$($(event.currentTarget)[0].parentElement.children[2*curIndex+1].children[0]).css('display','none');
	},
	'click .ui.fluid.manual.row.button' : function(event) {
		var tableIndex = Number($(event.currentTarget)[0].getAttribute('tableIndex'));
		var rowIndex = Number($(event.currentTarget)[0].getAttribute('rowIndex'));

		var submission = Session.get('currentSubmission');
		var curRow = submission.feedbackObj["sections"][tableIndex]["rows"][rowIndex];
		Session.set('manGradedRow', curRow);
		$('#viewFilesModal').modal({
			onApprove: function() {
				//Meteor.call('updateFeedBackObject', submission)
				Session.set('manGradedRow', null);
			}
		}).modal('show');

		console.log(curRow);
	}
});