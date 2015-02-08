(function(){AGSUsers = new Mongo.Collection('agsusers');
//AGSUsers.deny({update: function () { return true; }});

AGSCourses = new Mongo.Collection('courses');
AGSAssignments = new Mongo.Collection('assignments');
AGSSubmissions = new Mongo.Collection('submissions');

})();
