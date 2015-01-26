/** 
* @fileOverview crud.js - module to provide CRUD db capabilities
*/


/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
  loadSchema,   checkSchema,  clearIsOnline,
  checkType,    constructObj, readObj,
  updateObj,    connectObj,  destroyObj,
  checkObj,     getObjectIdByMap,
  addCourseToUser,  addAssignmentToUser,  addSubmissionToUser,  addStudentToUser,
  addUserToCourse,  addAssignmentToCourse,
  removeCourseFromUser, removeAssignmentFromUser, removeSubmissionFromUser, removeStudentFromUser,
  removeUserFromCourse, removeAssignmentFromCourse,
  createCourseAsInstructor, createAssignmentForCourse,  createSubmissionByStudent,
  createUserWithCheck,

  mongodb     = require( 'mongodb' ),
  fsHandle    = require( 'fs'      ),
  JSV         = require( 'JSV'     ).JSV,

  mongoServer = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
  ),
  dbHandle    = new mongodb.Db(
    'ags', mongoServer, { safe : true }
  ),
  validator   = JSV.createEnvironment(),

  objTypeMap  = { 
                  'users'        : {}, 
                  'courses'      : {}, 
                  'assignments'  : {},
                  'submissions'  : {}
  }
// ------------- END MODULE SCOPE VARIABLES ---------------

// ---------------- BEGIN UTILITY METHODS -----------------

/**
* Loads JSON schema into the Object type map
* @function
* @param {String} schema_name Name of the schema to load
* @param {String} schema_path Path to the JSON file that holds the object schema
*/
loadSchema = function ( schema_name, schema_path ) {
  fsHandle.readFile( schema_path, 'utf8', function ( err, data ) {
  	//console.log('loading ' + schema_name + ' schema');
    objTypeMap[ schema_name ] = JSON.parse( data );
    //console.log(schema_name + ' schema loaded');
  });
};

/**
* Validates data against schemas
* @function
* @param {String} obj_type Type of the data object to check
* @param {Object} obj_map Data object to check
* @param {function} callback Callback function that is called with the list of errors
*/
checkSchema = function ( obj_type, obj_map, callback ) {
  var
    schema_map = objTypeMap[ obj_type ],
    report_map = validator.validate( obj_map, schema_map );

  callback( report_map.errors );
};

/**
* Sets all users to offline
* @function
* @returns logs a response
*/
clearIsOnline = function () {
  updateObj(
    'users',
    { is_online : true  },
    { is_online : false },
    function ( response_map ) {
      console.log( 'All users set to offline', response_map );
    }
  );
};

/**
* Gets ID of object that matches map passed in
* @function
* @param {String} objType Type of object to find
* @param {Object} find_map Map of object to find
* @param {function} callback function to be called with first matching object id as an argument
*/
getObjectIdByMap = function (objType, find_map, callback) {
  dbHandle.collection(
    objType,
    function ( outer_error, collection ) {
      collection.findOne( find_map, function (err, obj) {
        if (obj!=null) {
          callback( obj._id.toString());
        } else {
          callback( {error_msg: "Data object does not exist."})
        }

      });
    }
  );
};

/**
* Checks if Objects matching find map exist
* @function
* @param {String} objType Type of object to find
* @param {Object} find_map Map of object to find
* @param {function} callback function to be called with an array of object id that match map as an argument
*/
checkObj = function ( obj_type, obj_find_map, callback) {
  readObj( obj_type, obj_find_map, {_id:true}, function(obj_list) {
    if(obj_list.length > 0) {
      callback(obj_list);
    } else {
      callback({error_msg: "Data object does not exist."})
    }
  });
};

/**
* Inserts course id into appropriate array of user object
* @function
* @param {Object} course_find_map Map to find course being added
* @param {Object} user_find_map Map to find user gaining the course
* @param {Function} callback use console log to see errors or update count
*/
addCourseToUser = function (course_find_map, user_find_map, callback) {

  var courseCol = dbHandle.collection('courses');

  courseCol.findOne( course_find_map, function(err, course){ 
    if(course != null) {
      var userCol = dbHandle.collection('users');
      userCol.update(
          user_find_map,
          { $addToSet: {id_Courses: course._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({user_error: inner_error});
              }
            }
        );
    } else {
      callback({course_error: err});
    }
  });
};

/**
* Inserts assignment id into appropriate array of user object
* @function
* @param {Object} ass_find_map Map to find assignment being added
* @param {Object} user_find_map Map to find user gaining the course
* @param {Function} callback use console log to see errors or update count
*/
addAssignmentToUser = function ( ass_find_map, user_find_map, callback) {
  var assignmentCol = dbHandle.collection('assignments');

  assignmentCol.findOne( ass_find_map, function(err, assignment){ 
    if(assignment != null) {
      var userCol = dbHandle.collection('users');
      userCol.update(
          user_find_map,
          { $addToSet: {id_Assignments: assignment._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({user_error: inner_error});
              }
            }
        );
    } else {
      callback({assignment_error: err});
    }
  });
};

/**
* Inserts a student user's id into appropriate array of an instructor user's object
* @function
* @param {Object} stud_find_map Map to find student user being added
* @param {Object} user_find_map Map to find instructor user gaining the student user
* @param {Function} callback use console log to see errors or update count
*/
addStudentToUser = function (stud_find_map, user_find_map, callback){
  var userCol = dbHandle.collection('users');

  user_find_map.isInstructor = true;

  userCol.findOne( stud_find_map, function(err, student){ 
    if(student != null) {
      if(!student.isStudent){
        callback({student_error: err, error_msg: "User is not a Student."})
      }
      userCol.update(
          user_find_map,
          { $addToSet: {id_Students: student._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({user_error: inner_error});
              }
            }
        );
    } else {
      callback({student_error: err});
    }
  });
};

/**
* Inserts submission id into appropriate array of user object
* @function
* @param {Object} sub_find_map Map to find submission being added
* @param {Object} user_find_map Map to find user gaining the submission
* @param {Function} callback use console log to see errors or update count
*/
addSubmissionToUser = function(sub_find_map, user_find_map, callback){
  var submissionCol = dbHandle.collection('submissions');

  submissionCol.findOne( sub_find_map, function(err, submission){ 
    if(submission != null) {
      var userCol = dbHandle.collection('users');
      userCol.update(
          user_find_map,
          { $addToSet: {id_Submissions: submission._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({user_error: inner_error});
              }
            }
        );
    } else {
      callback({submission_error: err});
    }
  });
};

/**
* Inserts user id into appropriate array of course object
* @function
* @param {Object} user_find_map Map to find user being added
* @param {Object} course_find_map Map to find course gaining the user
* @param {Function} callback use console log to see errors or update count
*/
addUserToCourse = function ( user_find_map, course_find_map, callback) {

  var userCol = dbHandle.collection('users');

  userCol.findOne( user_find_map, function(err, user){ 
    if(user!=null) {
      var courseCol = dbHandle.collection('courses');
      courseCol.update(
          course_find_map,
          { $addToSet: {id_Students: user._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({course_error: inner_error});
              }
            }
        );
    } else {
      callback({user_error: err});
    }
  });
};

/**
* Inserts assignment id into appropriate array of course object
* @function
* @param {Object} ass_find_map Map to find assignment being added
* @param {Object} course_find_map Map to find course gaining the assignment
* @param {Function} callback use console log to see errors or update count
*/
addAssignmentToCourse = function ( ass_find_map, course_find_map, callback ) {
  var assignmentCol = dbHandle.collection('assignments');

  assignmentCol.findOne( ass_find_map, function(err, assignment){ 
    if(assignment != null) {
      var courseCol = dbHandle.collection('courses');
      courseCol.update(
          course_find_map,
          { $addToSet: {id_Assignments: assignment._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({course_error: inner_error});
              }
            }
        );
    } else {
      callback({assignment_error: err});
    }
  });
};

/**
* Removes course id from appropriate array of user object
* @function
* @param {Object} course_find_map Map to find course being removed
* @param {Object} user_find_map Map to find user losing the course
* @param {Function} callback use console log to see errors or update count
*/
removeCourseFromUser = function (course_find_map, user_find_map, callback) {
  var courseCol = dbHandle.collection('courses');

  courseCol.findOne( course_find_map, function(err, course){ 
    if(course != null) {
      var userCol = dbHandle.collection('users');
      userCol.update(
          user_find_map,
          { $pull: {id_Courses: course._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              if(update_count>0) {
                callback({ update_count : update_count });
              } else {
                callback({user_error: inner_error});
              }
            }
        );
    } else {
      callback({course_error: err});
    }
  });
};

removeAssignmentFromUser = function ( ass_find_map, user_find_map) {

};

removeSubmissionFromUser = function(sub_find_map, user_find_map) {

};

removeStudentFromUser = function (stud_find_map, user_find_map) {

};

removeUserFromCourse = function ( user_find_map, course_find_map) {

};

removeAssignmentFromCourse = function ( ass_find_map, course_find_map ) {

};

/**
* Creates a course object in the database given an instructor user
* @function
* @param {Object} course_map Map of course object to add to database
* @param {Object} instructor_find_map Map to find instructor creating the course  
* @param {Object} callback callback function  
*/
createCourseAsInstructor = function ( course_map, instructor_find_map, callback) {
// does check for duplicates  
  var userCol = dbHandle.collection('users');

  userCol.findOne( instructor_find_map, function(err, user){ 
    if(user != null) {
      course_map.id_Instructor = user._id.toString();

      var courseCol = dbHandle.collection('courses');

      courseCol.findOne( { $or: [
        {title:course_map.title},
        {number:course_map.number}] },
        function( course_err, course) {
          if(course != null) {
            callback({error_msg: 'Course already exists.'});
          } else {
            constructObj('courses', course_map, function (result_map) {
              callback(course_map.title + " course created by " + user.name);
            });

          }
        }
      )

    } else {
      callback({user_error: err});
    }
  });
};

/**
* Creates a user object and checks if it already exists in database
* @function
* @param {Object} user_map Map of user object to add to database 
* @param {Object} callback callback function  
*/
createUserWithCheck = function ( user_map, callback) {
  var userCol = dbHandle.collection('users');

  userCol.findOne({username:user_map.username}, function(err, user){
    if(user != null) {
      // user already exists and username found in database
      callback({error_msg: 'User with that user name already exists.'});
    } else {
      // user does not already exist
      constructObj('users', user_map, function (result_map) {
        callback(user_map.username + " created.");
      });
    }
  });
};

createAssignmentForCourse = function ( ass_map, course_find_map, callback) {

};

createSubmissionByStudent = function ( sub_map, ass_find_map, stud_find_map) {

};

// ----------------- END UTILITY METHODS ------------------

// ---------------- BEGIN PUBLIC METHODS ------------------

/** Checks type map for valid data types
* @function 
* @param {String} obj_type Type to check
* @return {null | error} error message object
*/
checkType = function ( obj_type ) {
  if ( ! objTypeMap[ obj_type ] ) {
    return ({ error_msg : 'Object type "' + obj_type
      + '" is not supported.'
    });
  }
  return null;
};

/**
* Creates Object
* @function
*/
constructObj = function ( obj_type, obj_map, callback ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  checkSchema(
    obj_type, obj_map,
    function ( error_list ) {
      if ( error_list.length === 0 ) {
        dbHandle.collection(
          obj_type,
          function ( outer_error, collection ) {
            var options_map = { safe: true };

            collection.insert(
              obj_map,
              options_map,
              function ( inner_error, result_map ) {
                callback( result_map );
              }
            );
          }
        );
      }
      else {
        callback({
          error_msg  : 'Input document not valid',
          error_list : error_list
        });
      }
    }
  );
};

/** Reads object
* @function
*/
readObj = function ( obj_type, find_map, fields_map, callback ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  dbHandle.collection(
    obj_type,
    function ( outer_error, collection ) {
      collection.find( find_map, fields_map ).toArray(
        function ( inner_error, map_list ) {
          callback( map_list );
        }
      );
    }
  );
};

/**
* Updates Object
* @function
*/
updateObj = function ( obj_type, find_map, set_map, callback ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  checkSchema(
    obj_type, set_map,
    function ( error_list ) {
      if ( error_list.length === 0 ) {
        dbHandle.collection(
          obj_type,
          function ( outer_error, collection ) {
            collection.update(
              find_map,
              { $set : set_map },
              { safe : true, multi : true, upsert : false },
              function ( inner_error, update_count ) {
                callback({ update_count : update_count });
              }
            );
          }
        );
      }
      else {
        callback({
          error_msg  : 'Input document not valid',
          error_list : error_list
        });
      }
    }
  );
};

/**
* Destroys Object
* @function
*/
destroyObj = function ( obj_type, find_map, callback ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  dbHandle.collection(
    obj_type,
    function ( outer_error, collection ) {
      var options_map = { safe: true, single: true };

      collection.remove( find_map, options_map,
        function ( inner_error, delete_count ) {
          callback({ delete_count: delete_count });
        }
      );
    }
  );
};


module.exports = {
	makeMongoId	: mongodb.ObjectID,
	checkType: checkType,
	construct: constructObj,
	read: 	readObj,
	update: 	updateObj,
  connect: connectObj, 
	destroy: destroyObj,
  createCourse: createCourseAsInstructor,
  createUser: createUserWithCheck
};
// ----------------- END PUBLIC METHODS -------------------

// ------------- BEGIN MODULE INITIALIZATION --------------
dbHandle.open( function() {
	console.log( '** Connected to MongoDB **');
	clearIsOnline();

  // Connecting object example
  //addUserToCourse({username:"username3"},{number:"COP1234"}, console.log);
  //addCourseToUser({number:"COP1234"},{username:"username3"}, console.log);

  //Read Object example
  //readObj('users',{"username":"user1"}, {_id:true}, console.log);

  // Creating dependent object example
  /*
  getObjectIdByMap('users', {username:"proff"}, function (instructor) {
    var tempCourse = {
      title: "CS Course II",
      number: "COP1235",
      id_Instructor: instructor,
      id_Students: [],
      id_Assignments:[]
    };
    createCourseAsInstructor(
      tempCourse,
      {username:"proff"},
      console.log
    );
  });
  */

  //Check if data objects exist methods
  //checkObj('users', {username:"proff"}, console.log)
  //checkObj('users', {username:"profff"}, console.log)
  //checkObj('users', {is_online:false}, console.log);

    

});

//load schemas into memory (objTypeMap)
(function () {
	var schema_name, schema_path;
	for (schema_name in objTypeMap ) {
		if ( objTypeMap.hasOwnProperty( schema_name ) ) {
			schema_path = __dirname + '/json_schemas/' + schema_name + '.json';
			loadSchema( schema_name, schema_path );
		}
	}
}());
// -------------- END MODULE INITIALIZATION ---------------