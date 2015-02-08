(function(){
Template.__checkName("AGSCreateUser");
Template["AGSCreateUser"] = new Template("Template.AGSCreateUser", (function() {
  var view = this;
  return HTML.Raw('<div id="signUpForm">\n			<form method="post">\n				<fieldset>\n					<label for="userNameField">Username:</label>\n					<input type="text" id="userNameField" name="userNameField" placeholder="example1234">\n					<br>\n					\n					<label for="firstNameField">First Name:</label>\n					<input type="text" id="firstNameField" name="firstNameField" placeholder="First Name Here">\n					<br>\n					\n					<label for="lastNameField">Last Name:</label>\n					<input type="text" id="lastNameField" name="lastNameField" placeholder="Last Name Here">\n					<br>\n					\n					<label for="emailField">Email:</label>\n					<input type="text" id="emailField" name="emailField" placeholder="example@domain.com">\n					<br>\n					\n					<label for="passwordField">Password:</label>\n					<input type="password" id="passwordField" name="passwordField" placeholder="password1234">\n					<br>\n					\n					<label for="passwordConfirmField">Confirm Password:</label>\n					<input type="password" id="passwordConfirmField" name="passwordConfirmField" placeholder="password1234">\n					<br>\n				\n					<input type="submit" onclick="" value="Sign Up">\n					<label id="errorMsg" name="errorMsg"></label>\n				</fieldset>\n			</form>\n		</div>');
}));

})();
