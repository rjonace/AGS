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
  getUserByUsername,
  getCourseByTitle,
  getObjectIdByMap,
  makeObjectConnection,
  addCourseToUser,
  addUserToCourse,
  addIdToListWithMap,

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

getUserByUsername = function (username, callback) {
  dbHandle.collection(
    'users',
    function ( outer_error, collection ) {
      collection.find( { "username": username }, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            callback( map_list[0]._id );
          }
      );
    }
  );
};

getCourseByTitle = function (title, callback) {
  dbHandle.collection(
    'courses',
    function ( outer_error, collection ) {
      collection.find( { "title": title }, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            callback( map_list[0]._id );
          }
      );
    }
  );
};

getObjectIdByMap = function (objType, find_map, callback) {
  dbHandle.collection(
    objType,
    function ( outer_error, collection ) {
      collection.find( find_map, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            callback( map_list[0]._id );
          }
      );
    }
  );
}

addCourseToUser = function (courseNumber, username, callback) {

  dbHandle.collection(
    'courses',
    function ( outer_error, collection ) {
      collection.find( { "number":courseNumber }, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            var id_Course = map_list[0]._id;
              dbHandle.collection(
                'users',
                function ( outer_error, collection ) {
                  collection.update( 
                    { "username": username}, 
                    { $addToSet: {id_Courses: id_Course } },
                    { safe : true, multi : false, upsert : false },
                      function ( inner_error, update_count ) {
                        callback({ update_count : update_count });
                      }
                  );
                });
          }
      );
    }
  );

}

addIdToListWithMap = function (id_Object, id_Type, objType, find_map) {
  checkType(id_Type);
  console.log("id to add " + id_Object.toString());
  //updateObj(objType, find_map, { $addToSet: { id_Users: id_Object} })
}

/*
* @function
* @param firstObjType type of object to be added to second object list
* @param firstObjFindMap the map to find first object
* @param secondObjType type object with a list of first object type
* @param secondObjFindMap the map to find second object
* @param listName name of list in second object usually id_<firstObjType>s
* @param callback callback method 
*/
makeObjectConnection = function ( firstObjType, firstObjFindMap, secondObjType, secondObjFindMap, callback) {
  
  var setToAdd = {},
      id_FirstObject;

  function setId (id) {
    id_FirstObject = id;
    //console.log(id);
  }

  getObjectIdByMap(secondObjType, secondObjFindMap, setId);
  
  if (firstObjType == 'users') {
    setToAdd = { id_Users: id_FirstObject}
  } else if (firstObjType == 'courses') {
    setToAdd = { id_Courses: id_FirstObject}
  }

  //console.log(setToAdd);

  dbHandle.collection(
    firstObjType,
    function ( outer_error, collection ) {
      collection.find( firstObjFindMap, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            var temp_id = map_list[0]._id;
              dbHandle.collection(
                secondObjType,
                function ( outer_error, collection ) {
                  collection.update( 
                    secondObjFindMap, 
                    { $addToSet: setToAdd },
                    { safe : true, multi : false, upsert : false },
                      function ( inner_error, update_count ) {
                        callback({ update_count : update_count });
                      }
                  );
                });
          }
      );
    }
  );
}

addUserToCourse = function ( username, courseNumber, callback) {

  dbHandle.collection(
    'users',
    function ( outer_error, collection ) {
      collection.find( { "username": username }, {"_id": true} ).toArray( 
          function ( inner_error, map_list ) {
            var id_User = map_list[0]._id;
              dbHandle.collection(
                'courses',
                function ( outer_error, collection ) {
                  collection.update( 
                    { "number": courseNumber}, 
                    { $addToSet: {id_Users: id_User } },
                    { safe : true, multi : false, upsert : false },
                      function ( inner_error, update_count ) {
                        callback({ update_count : update_count });
                      }
                  );
                });
          }
      );
    }
  );
}


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
* Connects Objects
* @function
* @param obj_type adds the id of conn_obj_type to an object of this type
* @param find_map map of the object to find
* @param conn_type object type to connect
* @param conn_find_map object find map to connect
* @param callback callback method
*/
connectObj = function (obj_type, find_map, conn_type, conn_find_map, callback) {
    var type_check_map = checkType( obj_type ),
        conn_type_check_map = checkType( conn_type );
      if ( type_check_map ) {
        callback( type_check_map );
        return;
      }
      if ( conn_type_check_map ) {
        callback( conn_type_check_map );
        return;
      }

      checkSchema(
      obj_type, set_map,
      function ( error_list ) {
        if ( error_list.length === 0 ) {
          dbHandle.collection(
            obj_type,
            function ( outer_error, collection ) {
              collection.find( conn_find_map, { _id: id_User } ).toArray(
                function ( inner_error, map_list ) {
                  console.log( map_list );
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
}

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
	destroy: destroyObj 
};
// ----------------- END PUBLIC METHODS -------------------

// ------------- BEGIN MODULE INITIALIZATION --------------
dbHandle.open( function() {
	console.log( '** Connected to MongoDB **');
	clearIsOnline();
  //getUserByUsername('rjonace', function(map_list) { console.log(map_list);});

  console.log(
  "hello " + readObj('courses', {"number":"COP1234"},{"_id":true},function (map_list){ console.log( map_list) })
  );
  //addCourseToUser('COP1234', 'rjonace', console.log);
  //addUserToCourse('rjonace', 'COP1234', console.log);

  readObj(
    'users',
    {"username":"mattr"},
    {"_id":true},
    function (map_list) {
          addIdToListWithMap( 
          map_list, 
          'users',
          'courses',
          {"number":"COP1234"});
    }
  );

  makeObjectConnection( 
      'users',
      {"username":"user1"}, 
      'courses',
      {"title":"Computer Stuff 2"},
      function (){}
    );



});

//load schemas into memory (objTypeMap)
(function () {
	var schema_name, schema_path;
	for (schema_name in objTypeMap ) {
		if ( objTypeMap.hasOwnProperty( schema_name ) ) {
			schema_path = __dirname + '/' + schema_name + '.json';
			loadSchema( schema_name, schema_path );
		}
	}
}());
// -------------- END MODULE INITIALIZATION ---------------