Template.mainContent.helpers({
	'userCourseList': function(){
		var courseIdList = AGSUsers.findOne({_id:Meteor.userId()}).id_Courses;
		return AGSCourses.find(({_id : { $in: courseIdList}}), {sort: {number: 1, name: 1} });
	},
	'userInfo': function(){
		return AGSUsers.findOne({_id:Meteor.userId()});
	},
	'courseInfo': function(){
		return Session.get('currentCourse');
	},
	'assignmentInfo': function(){
		return Session.get('currentAssignment');
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
	'click #write': function(){
		Meteor.call('writeFiles', Session.get('currentAssignment'), '/AGS');
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

					var vtaReader = new FileReader();
					var solutionReader = new FileReader();
					var inputReader = new FileReader();

					var vta = event.target.assignmentVTAField.files[0];
					var solution = event.target.assignmentSolutionField.files[0];
					var inputFileList = event.target.assignmentInputField.files;

					var vtaObj, solutionObj;

					vtaReader.onloadend = function(){
						vtaObj = {name: vta.name, contents:vtaReader.result};
						Meteor.call('insertAssignmentVTA', result, vtaObj.name, vtaObj.contents);
					}

					solutionReader.onloadend = function(){
						solutionObj = {name: solution.name, contents:solutionReader.result};
						Meteor.call('insertAssignmentSolution', result, solutionObj.name, solutionObj.contents);
					}

					if (vta)
						vtaReader.readAsText(vta);

					if (solution)
						solutionReader.readAsText(solution);

					if(inputFileList.length > 0) {
						for (var i = 0; i < inputFileList.length; i++) {
							(function(file) {
								var name = file.name;
								var reader = new FileReader();
								reader.onloadend = function(event) {
									Meteor.call('insertAssignmentInput', result, name, reader.result);
								}
								reader.readAsText(file);
							})(inputFileList[i]);
						};
					}


				} else {
					console.log(error);
				}
			}
		);
	},
	'click #newSubmission': function(){
		Session.set('currentSubmission', 
			Meteor.call('createNewSubmission', 
				Meteor.userId(),
				Session.get('currentAssignment')._id ));
		Session.set('currentDashboard', "submissionDash");
	}
})