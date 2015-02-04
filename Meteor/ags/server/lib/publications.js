Meteor.publish('coursesList', function (){
	var currentUserId = this.UserId;
	var courseIdList = AGSUsers.findOne({_id:currentUserId},{_id:false,id_Courses:true}).id_Courses[0];
	console.log(courseIdList);
	return AGSCourses.find({_id : { $in: courseIdList}});
});

Meteor.publish('usersList', function(){ 
	return Meteor.users.find({_id:currentUserId}, 
							{fields :{'id_Courses': 1}})
});