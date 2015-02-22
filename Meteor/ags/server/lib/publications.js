Meteor.users.deny({update: function () { return true; }});

Meteor.publish('availableCourses', function(){
	return AGSCourses.find();
});

Meteor.publish('allAssignments', function(){
	return AGSAssignments.find();
});

Meteor.publish('coursesList', function (){
	if (!this.userId){
		this.ready();
		return;
	}

	var userObj = AGSUsers.findOne({_id:this.userId});
	var courseIdList = (userObj) ? userObj.id_Courses : [];

	return AGSCourses.find({$or: [{_id : { $in: courseIdList}}, {id_Instructor: this.userId}]} );
});

Meteor.publish('currentUserInfo', function(){
	if (!this.userId){
		this.ready();
		return;
	}

	var userObj = AGSUsers.findOne({_id:this.userId});
	var studentIdList = (userObj) ? userObj.id_Students : [];
	
	return AGSUsers.find({$or: [{_id: this.userId}, {_id: {$in: studentIdList}}]); 
});

Meteor.publish('submissionData', function () {
	return AGSSubmissions.find({
		$or: [ {id_Student: this.userId}, {id_Instructor: this.userId} ]
	});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'createdAt': 1}});
  } else {
    this.ready();
  }
});