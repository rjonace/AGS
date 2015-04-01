/*	Server side Submission methods*/
Meteor.methods({
	'insertJSONFile' : function(id_Student, id_Assignment, subNumber){
		//Meteor.call('insertJSONFile',Meteor.userId(),'Ny3mL2TDncYQ9Aoqx',1)
		var fs = Npm.require('fs');
		var feedbackJSON = JSON.parse(fs.readFileSync('/home/student/ags/vta/version2/feedback2.json', 'utf8'));
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				 $set: {
				 	"AttemptList.$.feedbackObj": feedbackJSON
				 } 
			} 
		);
	},
	'createNewSubmission': function(id_User, id_Assignment, id_Instructor){
		var sub = AGSSubmissions.findOne({
			id_Student: id_User,
			id_Assignment: id_Assignment
		});

		var student = AGSUsers.findOne({_id:id_User});
		var studentName = student.lastname + ", " + student.firstname;

		if (!sub) {

			return AGSSubmissions.insert({
				id_Student: id_User,
				id_Assignment: id_Assignment,
				id_Instructor: id_Instructor,
				AttemptCount: 1,
				AttemptList: [{ id_Student: id_User, studentName: studentName, name: 'Submission 1' , dateCreated: new Date() , subNumber : 0}]
			}, function(err, id) {
				console.log(err);
				AGSAssignments.update(
					{_id:id_Assignment},
					{ $addToSet: { id_Submissions: id}}
				);
			});

		} else {
			AGSSubmissions.update(
					sub,
					{ 	$inc: { AttemptCount: 1 },
						$addToSet: { AttemptList: { id_Student: id_User, studentName: studentName, name: 'Submission ' + (sub.AttemptCount+1) , dateCreated: new Date(), subNumber : sub.AttemptCount } }
					}
			);
			return AGSSubmissions.findOne({
				id_Student: id_User,
				id_Assignment: id_Assignment
			});
		}
	},
	'insertSubmissionSolution' : function(id_Student, id_Assignment, subNumber, filename, contents){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				// $set: {
				// 	"AttemptList.$.filename": filename, 
				// 	"AttemptList.$.contents": contents
				// } 
				$addToSet : {
					"AttemptList.$.files": { name : filename, contents : contents }
				}
			} 
		);
		return AGSSubmissions.findOne({ id_Student: id_Student, id_Assignment: id_Assignment });
	},
	'resetSubmissionSession' : function(id_User, id_Assignment, submission) {
		return AGSSubmissions.findOne({ id_Student: id_User, id_Assignment: id_Assignment }).AttemptList[submission.subNumber];
	}
});