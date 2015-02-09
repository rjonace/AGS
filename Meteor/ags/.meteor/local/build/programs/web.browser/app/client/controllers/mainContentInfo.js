(function(){Template.mainContent.helpers({
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
	}
});

Template.mainContent.events({
	'submit #createCourse': function(event){
		event.preventDefault();
		alert("Course event")
		var courseTitle = event.target.courseNameField.value;
		var courseNumber = event.target.courseNumberField.value;
		var courseSemester = event.target.courseSemesterField.value;
		var courseYear = event.target.courseYearField.value;
		Meteor.call('insertCourseData', courseTitle, courseNumber, courseSemester, courseYear);
	},
	'click .userCourse': function(){
		Session.set('currentCourse', this)
		Session.set('currentDashboard', "courseDash");
	},
	'submit #createAssignment': function(event){
		event.preventDefault();
		var name = event.target.assignmentNameField.value;
		var description = event.target.assignmentDescriptionField.value;
		var dateAvailable = event.target.assignmentDateAvailableField.value;
		var dateDue = event.target.assignmentDateDueField.value;
		var points = event.target.assignmentPointsField.value;

		var vtaReader = new FileReader();
		var solutionReader = new FileReader();

		var vta = event.target.assignmentVTAField.files[0];
		var solution = event.target.assignmentSolutionField.files[0];
		var inputFileList = event.target.assignmentInputField.files;

		var vtaObj, solutionObj, inputObjList = [];
/*
		for(var i=0; i < inputFileList.length; i++) {
			inputReaderList.push(new FileReader());
			var input = inputFileList[i];
			inputReader.readAsText(input);

			inputObjList.push({name: input.name, contents:inputReader.result});
		}*/

/*		inputFileList.map(function(item, index, array){
			var inputReader = new FileReader();
			inputReader.onload = function(){
				inputObjList.push({name: item.name, contents:inputReader.result});
			}
			inputReader.readAsText(item);
		})*/



		vtaReader.onloadend = function(){
			vtaObj = {name: vta.name, contents:vtaReader.result};
		}

		solutionReader.onloadend = function(){
			solutionObj = {name: solution.name, contents:solutionReader.result};
		}
		
		vtaReader.readAsText(vta);
		solutionReader.readAsText(solution);

		while(vtaReader.readyState != vtaReader.DONE);

		var currentCourseId = Session.get('currentCourse')._id;
		Meteor.call('insertAssignmentData', currentCourseId, name, description, dateAvailable, dateDue, points, vtaObj, solutionObj, inputObjList);
	},
})

})();
