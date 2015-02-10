(function(){
Template.__checkName("mainContent");
Template["mainContent"] = new Template("Template.mainContent", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "ags-main-content-info"
  }, "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("unfinishedAccount"));
  }, function() {
    return [ "\n			", HTML.H2("Finish Creating Your Account"), "\n		" ];
  }, function() {
    return [ "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isUserDash"));
    }, function() {
      return [ "\n				\n				", Spacebars.With(function() {
        return Spacebars.call(view.lookup("userInfo"));
      }, function() {
        return [ "\n					User: ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("firstname"));
        }), " ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("lastname"));
        }), "\n				" ];
      }), "\n\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isCourseDash"));
    }, function() {
      return [ "\n\n				", Spacebars.With(function() {
        return Spacebars.call(view.lookup("courseInfo"));
      }, function() {
        return [ "\n					Course: ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("name"));
        }), " ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("number"));
        }), "\n				" ];
      }), "\n\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isAssignmentDash"));
    }, function() {
      return [ "\n\n				", Spacebars.With(function() {
        return Spacebars.call(view.lookup("assignmentInfo"));
      }, function() {
        return [ "\n					Assignment: ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("name"));
        }), HTML.BR(), "\n					", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("description"));
        }), " ", HTML.BR(), "\n					Date Available: ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("dateAvailable"));
        }), HTML.BR(), " Date Due:", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("dateDue"));
        }), "\n				" ];
      }), "\n\n			" ];
    }), "\n\n		" ];
  }), "\n	"), "\n	", HTML.DIV({
    "class": "ags-main-content-view"
  }, "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("unfinishedAccount"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("AGSCreateUser")), "\n		" ];
  }, function() {
    return [ "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isUserDash"));
    }, function() {
      return [ "\n				", HTML.H2("Your courses"), "\n				", HTML.UL("\n					", Blaze.Each(function() {
        return Spacebars.call(view.lookup("userCourseList"));
      }, function() {
        return [ "\n						", HTML.LI({
          "class": "userCourse"
        }, HTML.A(Blaze.View(function() {
          return Spacebars.mustache(view.lookup("number"));
        }), ": ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("name"));
        }))), "\n					" ];
      }), "\n				"), "\n				", Spacebars.include(view.lookupTemplate("addCourseForm")), "\n				\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isCourseDash"));
    }, function() {
      return [ "\n				", HTML.H2("Course assignments"), "\n				", HTML.UL("\n					", Blaze.Each(function() {
        return Spacebars.call(view.lookup("courseAssignmentList"));
      }, function() {
        return [ "\n						", HTML.LI({
          "class": "courseAssignment"
        }, HTML.A(Blaze.View(function() {
          return Spacebars.mustache(view.lookup("name"));
        }), ": ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("dateDue"));
        }))), "\n					" ];
      }), "\n				"), "\n				", Spacebars.include(view.lookupTemplate("addAssignmentForm")), "\n				\n\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isAssignmentDash"));
    }, function() {
      return [ "\n				", HTML.H2("Assignment submissions"), "\n				\n\n			" ];
    }), "\n		" ];
  }), "\n\n\n	") ];
}));

})();
