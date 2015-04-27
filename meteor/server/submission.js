/*	Server side Submission methods*/
Meteor.methods({
	'insertSubmissionError' : function(id_Student, id_Assignment, subNumber, error){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$set : {
					"AttemptList.$.error": error
				}
			} 
		);
	},
	'updateSubmissionStatus' : function(id_Student, id_Assignment, subNumber, status){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$set : {
					"AttemptList.$.status": status
				}
			} 
		);
	},
	'updateFeedbackObj' : function(id_Student, id_Assignment, subNumber, newFeedbackObj){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				 $set: {
				 	"AttemptList.$.feedbackObj": newFeedbackObj
				 } 
			} 
		);
	},
	'insertJSONFile' : function(id_Student, id_Assignment, subNumber, feedbackFile){
		var fs = Npm.require('fs');
		var feedbackJSON = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));
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
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$set : {
					"AttemptList.$.status": 'graded'
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

			AGSSubmissions.insert({
				id_Student: id_User,
				id_Assignment: id_Assignment,
				id_Instructor: id_Instructor,
				AttemptCount: 1,
				AttemptList: [{ id_Student: id_User, studentName: studentName, name: 'Submission 1' , dateCreated: new Date().toLocaleString() , subNumber : 0, status : 'created'}]
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
						$addToSet: { AttemptList: { id_Student: id_User, studentName: studentName, name: 'Submission ' + (sub.AttemptCount+1) , dateCreated: new Date(), subNumber : sub.AttemptCount, status : 'created' } }
					}
			);
		};

		return AGSSubmissions.findOne({id_Student: id_User, id_Assignment: id_Assignment});
	},
	'insertSubmissionSolution' : function(id_Student, id_Assignment, subNumber, filename, contents){
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$addToSet : {
					"AttemptList.$.files": { name : filename, contents : contents }
				}
			} 
		);
		AGSSubmissions.update(
			{
				"id_Student": id_Student,
				"id_Assignment": id_Assignment,
				"AttemptList.subNumber": subNumber
			}, 
			{ 
				$set : {
					"AttemptList.$.status": 'files submitted'
				}
			} 
		);
		return AGSSubmissions.findOne({ id_Student: id_Student, id_Assignment: id_Assignment });
	},
	'resetSubmissionSession' : function(id_User, id_Assignment, submission) {
		return AGSSubmissions.findOne({ id_Student: id_User, id_Assignment: id_Assignment }).AttemptList[submission.subNumber];
	}
});