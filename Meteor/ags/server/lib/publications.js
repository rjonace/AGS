Meteor.users.deny({update: function () { return true; }});

Meteor.publish('coursesList', function (){
	if (!this.userId){
		this.ready();
		return;
	}

	var courseIdList = AGSUsers.findOne({_id:this.userId}).id_Courses;
	return AGSCourses.find({_id : { $in: courseIdList}});
});

Meteor.publish('currentUserInfo', function(){
	if (!this.userId){
		this.ready();
		return;
	}
	return AGSUsers.find({_id: this.userId}); 
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'createdAt': 1}});
  } else {
    this.ready();
  }
});