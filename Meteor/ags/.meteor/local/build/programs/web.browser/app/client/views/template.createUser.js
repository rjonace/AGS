(function(){
Template.__checkName("AGSCreateUser");
Template["AGSCreateUser"] = new Template("Template.AGSCreateUser", (function() {
  var view = this;
  return HTML.DIV({
    id: "signUpForm"
  }, "\n			", HTML.FORM({
    method: "post",
    id: "createUser"
  }, "\n				", HTML.FIELDSET("\n					\n					", HTML.Raw('<label for="firstNameField">First Name:</label>'), "\n					", HTML.Raw('<input type="text" id="firstNameField" name="firstNameField">'), "\n					\n					\n					", HTML.Raw('<label for="lastNameField">Last Name:</label>'), "\n					", HTML.Raw('<input type="text" id="lastNameField" name="lastNameField">'), "\n					", HTML.Raw("<br>"), "\n\n					", HTML.Raw('<label for="majorField">Major:</label>'), "\n					", HTML.Raw('<input type="text" id="majorField" name="majorField">'), "\n					", HTML.Raw("<br>"), "\n					", HTML.Raw("<br>"), "\n					", HTML.Raw('<label for="userCourse">Select Courses:</label>'), "\n					", HTML.Raw("<br>"), "\n\n					", HTML.TABLE("\n					", Blaze.Each(function() {
    return Spacebars.dataMustache(view.lookup("addIndex"), view.lookup("courseList"));
  }, function() {
    return [ "\n						", HTML.TR("\n							", HTML.TD(Blaze.View(function() {
      return Spacebars.mustache(view.lookup("index"));
    })), "\n							", HTML.TD(HTML.INPUT({
      type: "checkbox",
      name: "userCourse",
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("value"), "_id"));
      }
    })), "\n							", HTML.TD(Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("value"), "number"));
    }), ": ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("value"), "name"));
    })), "\n							", HTML.BR(), "\n						"), "\n					" ];
  }), "\n					"), "\n\n					", HTML.Raw("<br>"), "\n\n					", HTML.Raw('<input type="submit" onclick="submitUser" value="Sign Up">'), "\n					", HTML.Raw('<label id="errorMsg" name="errorMsg"></label>'), "\n				"), "\n\n\n			"), "\n		");
}));

})();
