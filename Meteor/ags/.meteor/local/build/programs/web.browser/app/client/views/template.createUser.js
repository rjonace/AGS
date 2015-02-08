(function(){
Template.__checkName("AGSCreateUser");
Template["AGSCreateUser"] = new Template("Template.AGSCreateUser", (function() {
  var view = this;
  return HTML.DIV({
    id: "signUpForm"
  }, "\n			", HTML.FORM({
    method: "post"
  }, "\n				", HTML.FIELDSET("\n					\n					", HTML.Raw('<label for="firstNameField">First Name:</label>'), "\n					", HTML.Raw('<input type="text" id="firstNameField" name="firstNameField">'), "\n					\n					\n					", HTML.Raw('<label for="lastNameField">Last Name:</label>'), "\n					", HTML.Raw('<input type="text" id="lastNameField" name="lastNameField">'), "\n					", HTML.Raw("<br>"), "\n\n					", HTML.Raw('<label for="majorField">Major:</label>'), "\n					", HTML.Raw('<input type="text" id="majorField" name="majorField">'), "\n					", HTML.Raw("<br>"), "\n					", HTML.Raw("<br>"), "\n					", HTML.Raw('<label for="userCourse">Select Courses:</label>'), "\n					", HTML.Raw("<br>"), "\n\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("courseList"));
  }, function() {
    return [ "\n							", HTML.INPUT({
      type: "checkbox",
      id: "userCourse",
      name: "userCourse",
      value: function() {
        return Spacebars.mustache(view.lookup("_id"));
      }
    }), Blaze.View(function() {
      return Spacebars.mustache(view.lookup("number"));
    }), ": ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("name"));
    }), HTML.BR(), "\n					" ];
  }), "\n\n					", HTML.Raw("<br>"), "\n\n					", HTML.Raw('<input type="submit" onclick="" value="Sign Up">'), "\n					", HTML.Raw('<label id="errorMsg" name="errorMsg"></label>'), "\n				"), "\n\n\n			"), "\n		");
}));

})();
