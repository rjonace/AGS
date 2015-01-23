/*
 * routes.js - module to provide routing
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
  configRoutes,
  crud        = require( './crud' ),
  makeMongoId = crud.makeMongoId;
// ------------- END MODULE SCOPE VARIABLES ---------------

// ---------------- BEGIN PUBLIC METHODS ------------------
configRoutes = function ( app, server ) {
  app.get( '/', function ( request, response ) {
    response.redirect( '/spa.html' );
  });

  app.post( '/user/create', function (request, response) {

      var body = request.body
      var tempUser = {
          is_online: true,
          username: body.userNameField,
          password: body.passwordField,
          name: body.firstNameField + " " + body.lastNameField,
          email: body.emailField,
          isInstructor: false,
          isStudent: false,
          id_Courses: [],
          id_Assignments: [],
          id_Students: [],
          id_Submissions: []
      };

      crud.construct(
        'users',
        tempUser,
        function ( result_map ) { 
          console.log( result_map); 
          response.redirect('/json/users/list');
        }
      );

  });

  app.post( '/assignment/create', function (request, response) {


      var body = request.body;
          console.log(body.assignmentFilesField);

      var tempAssignment = {
          name: body.assignmentNameField,
          description: body.assignmentDescriptionField,
          language: body.assignmentLanguageField,
          dateDue: body.assignmentDateField,
          files: body.assignmentFilesField,
          vta: body.assignmentGraderField,
          id_Course: "54c1895dd12da9248b81ad31"
      };

      crud.construct(
        'assignments',
        tempAssignment,
        function ( result_map ) { 
          console.log( result_map); 
          response.redirect('/json/assignments/list');
        }
      );

  });

  app.all( '/json/:obj_type/*?', function ( request, response, next ) {
    response.contentType( 'json' );
    next();
  });

  app.get( '/json/:obj_type/list', function ( request, response ) {
    crud.read(
      request.params.obj_type,
      {}, {},
      function ( map_list ) { response.send( map_list ); }
    );
  });

  app.post( '/json/:obj_type/create', function ( request, response ) {
    crud.construct(
      request.params.obj_type,
      request.body,
      function ( result_map ) { response.send( result_map ); }
    );
  });

  app.get( '/json/:obj_type/read/:id', function ( request, response ) {
    crud.read(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      {},
      function ( map_list ) { response.send( map_list ); }
    );
  });

  app.post( '/json/:obj_type/update/:id', function ( request, response ) {
    crud.update(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      request.body,
      function ( result_map ) { response.send( result_map ); }
    );
  });

  app.get( '/json/:obj_type/delete/:id', function ( request, response ) {
    crud.destroy(
      request.params.obj_type,
      { _id: makeMongoId( request.params.id ) },
      function ( result_map ) { response.send( result_map ); }
    );
  });

};

module.exports = { configRoutes : configRoutes };
// ----------------- END PUBLIC METHODS -------------------
