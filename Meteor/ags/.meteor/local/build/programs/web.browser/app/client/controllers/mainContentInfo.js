(function(){Template.mainContent.helpers({
	'userCourseList': function(){
		var courseIdList = AGSUsers.findOne({_id:Meteor.userId()}).id_Courses;
		return AGSCourses.find(({_id : { $in: courseIdList}}), {sort: {number: 1, name: 1} });
	},
	'userInfo': function(){
		return AGSUsers.findOne();
	},
	'courseInfo': function(){
		return Session.get('currentCourse');
	},
	'unfinishedAccount': function(){
		return (AGSUsers.find().count() == 0);
	},
	'courseAssignmentList' : function() {
		var courseId = Session.get('currentCourse')._id;
		var assIdList = AGSCourses.findOne({_id:courseId}).id_Assignments;
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

		var fileReader = new FileReader();

		var vta = event.target.assignmentVTAField.files[0];
		fileReader.readAsText(vta);
	//	while(fileReader.readyState != fileReader.DONE);
		alert("Done reading VTA File");
		var vtaObj = {name: vta.name, contents:fileReader.result};

		var solution = event.target.assignmentSolutionField.files[0];
		/*fileReader.readAsText(solution);
	//	while(fileReader.readyState != fileReader.DONE);
		alert("Done reading Solution File");
		var solutionObj = {name: solution.name, contents:fileReader.result};*/

		var inputObjList = [];
		/*for(var i=0; i < event.target.assignmentInputField.files.length; i++) {
			var input = event.target.assignmentInputField.files[i];
			fileReader.readAsText(input);
	//		while(fileReader.readyState != fileReader.DONE);
			inputObjList.push({name: input.name, contents:fileReader.result});
		}*/
		alert("Done reading Input File(s)");

		var currentCourseId = Session.get('currentCourse')._id;
		Meteor.call('insertAssignmentData', currentCourseId, name, description, dateAvailable, dateDue, points, vtaObj, solutionObj, inputObjList);
	},
})

})();
