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
        return [ "\n					Welcome ", Blaze.View(function() {
          return Spacebars.mustache(view.lookup("firstname"));
        }), "!\n				" ];
      }), "\n\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isCourseDash"));
    }, function() {
      return "\n\n			\n\n			";
    }), "\n		" ];
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
      }), "\n				"), "\n			\n				\n			" ];
    }), "\n\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isCourseDash"));
    }, function() {
      return [ "\n				", Spacebars.include(view.lookupTemplate("addCourseForm")), "\n			\n\n			" ];
    }), "\n		" ];
  }), "\n\n\n	") ];
}));

})();
