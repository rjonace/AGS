/*	Server side User methods*/
Meteor.methods({
	'createUserData': function(id, first, last, id_Courses){
		AGSUsers.update(
		{_id:id},			//selector
		{					//modifier
			_id: id,
			firstname: first,
			lastname: last,
			id_Courses: id_Courses
		},
		{upsert : true},	//options
		 function(err, id){	//callback
			if (err)
				console.log(err);
			else
				console.log(id);
		});
	},
	'checkCourseKey' : function(courseKey) {
		return AGSCourses.findOne({key:courseKey});
	},
	'enrollInCourse': function(selectedCourse){
		var currentUserId = Meteor.userId();
		AGSCourses.update(
			selectedCourse,
			{ $addToSet: { id_Students: currentUserId } }
		);
		AGSUsers.update( 
			{ _id: currentUserId },
			{ $addToSet: { id_Courses: selectedCourse._id} }
		);
		AGSUsers.update( 
			{ _id: selectedCourse.id_Instructor },
			{ $addToSet: { id_Students: currentUserId} }
		);
	}
});