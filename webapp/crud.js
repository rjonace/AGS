/*
 * crud.js - module to provide CRUD db capabilities
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
  getObjectIdByMap,
  addCourseToUser,
  addAssignmentToUser,
  addSubmissionToUser,
  addStudentToUser,
  addUserToCourse,
  addAssignmentToCourse,
  createCourseAsInstructor,

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
/*
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

/*
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

getObjectIdByMap = function (objType, find_map, callback) {
  dbHandle.collection(
    objType,
    function ( outer_error, collection ) {
      collection.findOne( find_map, function (err, obj) {
        callback( obj._id.toString());
      });
    }
  );
};

addCourseToUser = function (course_find_map, user_find_map) {

  var courseCol = dbHandle.collection('courses');

  courseCol.findOne( course_find_map, function(err, course){ 

    if(!err) {

      var userCol = dbHandle.collection('users');

      userCol.update(
          user_find_map,
          { $addToSet: {id_Courses: course._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              console.log({ update_count : update_count });
            }    
        );
      }
  });
};

addAssignmentToUser = function ( ass_find_map, user_find_map) {

};

addStudentToUser = function (stud_find_map, user_find_map){

};

addSubmissionToUser = function(sub_find_map, user_find_map){

};

addUserToCourse = function ( user_find_map, course_find_map) {

  var userCol = dbHandle.collection('users');

  userCol.findOne( user_find_map, function(err, user){ 

    if(!err) {

      var courseCol = dbHandle.collection('courses');

      courseCol.update(
          course_find_map,
          { $addToSet: {id_Students: user._id.toString()}},
          { safe : true, multi : true, upsert : false },
            function ( inner_error, update_count ) {
              console.log({ update_count : update_count });
            }    
        );
      }
  });
};

addAssignmentToCourse = function ( ass_find_map, course_find_map ) {
};

// does not check for duplicates
createCourseAsInstructor = function ( course_map, instructor_find_map, callback) {
  
  var userCol = dbHandle.collection('users');

  userCol.findOne( instructor_find_map, function(err, user){ 

    if(!err) {
      course_map.id_Instructor = user._id.toString();

      constructObj('courses', course_map, function (result_map) {
        console.log(course_map.title + " course created by " + user.name );
      });
    }
  });
};

// ----------------- END UTILITY METHODS ------------------

// ---------------- BEGIN PUBLIC METHODS ------------------
/*
* Checks type map for valid data types
* @function
* @param {String} obj_type Type to check
*/
checkType = function ( obj_type ) {
  if ( ! objTypeMap[ obj_type ] ) {
    return ({ error_msg : 'Object type "' + obj_type
      + '" is not supported.'
    });
  }
  return null;
};

/*
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

/* Reads object
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

/*
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

/*
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
  createCourse: createCourseAsInstructor
};
// ----------------- END PUBLIC METHODS -------------------

// ------------- BEGIN MODULE INITIALIZATION --------------
dbHandle.open( function() {
	console.log( '** Connected to MongoDB **');
	clearIsOnline();

  //addUserToCourse({username:"rjonace"},{number:"COP1234"});
  //addCourseToUser({number:"COP1234"},{username:"rjonace"});

  //readObj('users',{"username":"user1"}, {_id:true}, console.log);

  /*
  getObjectIdByMap('users', {username:"proff"}, function (instructor) {
    var tempCourse = {
      title: "Another CS Course",
      number: "COP4321-001",
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
// -------------- END MODULE INITIALIZATION ---------------}