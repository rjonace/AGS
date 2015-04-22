/*	Server side Course Methods*/
Meteor.methods({
	'insertCourseData': function(name, number, semester, year, description) {
		var currentUserId = Meteor.userId();
		var courseKey = AGSCourses._makeNewID();
		AGSCourses.insert({
			name: name,
			number: number,
			semester: semester,
			year: year,
			description: description,
			key: courseKey,
			id_Instructor: currentUserId,
			id_Students: [],
			id_Assignments: []
		}, function(err,id){
			var fs = Npm.require('fs');
			fs.mkdirSync('/home/student/ags/grading/courses/'+id);
			//AGSUsers.update(
			//	{_id:currentUserId},
			//	{ $addToSet: { id_Courses: id}}
			//);
		});
	},
	'updateCourseData' :function(id, name, number, semester, year, description){
		AGSCourses.update(
		{_id:id},			//selector
		{$set: {					//modifier
			name: name,
			number: number,
			semester: semester,
			year: year,
			description: description
		}},
		{upsert : false},	//options
		 function(err, result){	//callback
			if (err)
				console.log(err);
		});
	},
	'removeCourseData': function(id_Course){
		AGSCourses.remove({_id:id_Course});
		AGSUsers.update(
			{},
			{ $pull : 
				{id_Courses: id_Course}
			},
			{ multi:true });
		AGSAssignments.remove({id_Course:id_Course});
		
		// remove all references to the course?
		var exec = require( 'child_process' ).exec;
		if (id_Course){
			var path = '/home/student/ags/grading/courses/' +id_Course;
			exec( 'rm -r ' + path, function ( err, stdout, stderr ){
			  if (!err) console.log("course removed!");
			  else console.log(err);
			});
		};
	},
	'resetCurrentCourse': function(id_Course){
		return AGSCourses.findOne({_id:id_Course});
	}
});