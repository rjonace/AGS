(function(){
Template.__checkName("addCourseForm");
Template["addCourseForm"] = new Template("Template.addCourseForm", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n		", HTML.FORM("\n			", HTML.H2("Create Course"), "\n			", HTML.TABLE({
      border: "0"
    }, "\n				", HTML.TBODY("\n					", HTML.TH({
      colspan: "4"
    }, "\n						Create Course\n					"), "\n					", HTML.TR("\n						", HTML.TD({
      align: "right"
    }, "	\n							", HTML.LABEL({
      "for": "courseNameField"
    }, "Name:"), "\n						"), "	\n						", HTML.TD("	\n							", HTML.INPUT({
      type: "text",
      name: "courseNameField"
    }), "\n						"), "\n						", HTML.TD({
      align: "right"
    }, "	\n							", HTML.LABEL({
      "for": "courseNumberField"
    }, "Number:"), "	\n						"), "\n						", HTML.TD("	\n							", HTML.INPUT({
      type: "text",
      name: "courseNumberField"
    }), "\n						"), "\n					"), "	\n					", HTML.TR("\n						", HTML.TD({
      align: "right"
    }, "\n							", HTML.LABEL({
      "for": "courseSemesterField"
    }, "Semester:"), "\n						"), "\n						", HTML.TD("\n							", HTML.INPUT({
      type: "radio",
      id: "courseSemesterFieldFall",
      name: "courseSemesterField",
      value: "Fall"
    }), "Fall", HTML.BR(), "\n							", HTML.INPUT({
      type: "radio",
      id: "courseSemesterFieldSpring",
      name: "courseSemesterField",
      value: "Spring"
    }), "Spring", HTML.BR(), "\n							", HTML.INPUT({
      type: "radio",
      id: "courseSemesterFieldSummer",
      name: "courseSemesterField",
      value: "Summer"
    }), "Summer", HTML.BR(), "\n						"), "\n						", HTML.TD({
      align: "right"
    }, "	\n							", HTML.LABEL({
      "for": "courseYearField"
    }, "Year:"), "	\n						"), "\n						", HTML.TD("	\n							", HTML.INPUT({
      type: "text",
      name: "courseYearField"
    }), "\n						"), "\n					"), "\n					", HTML.TR("\n						", HTML.TD({
      alight: "right"
    }, "\n							", HTML.INPUT({
      type: "submit",
      value: "Add Course"
    }), "\n						"), "\n					"), "\n				"), "\n			"), "\n			\n		"), "\n	" ];
  });
}));

})();