(function(){
Template.__checkName("agsMain");
Template["agsMain"] = new Template("Template.agsMain", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ags-main"
  }, HTML.Raw('\n		<div class="ags-main-nav">\n			<div class="ags-nav-entry">\n				<p><b>Current Courses:</b></p>\n				\n				<a href="COP3502.html">Computer Science I</a><br>\n				<a href="COP3330.html">Object-Oriented Programming</a><br>\n				<a href="COT4500.html">Numerical Calculus</a>\n				\n				<p><b>Past Courses:</b></p>\n				<a href="COP3223.html">Introduction to<br>Programming with C</a><br>\n				<a href="COP2500">Concepts of Computer Science</a>\n			</div>\n		</div>\n\n		'), HTML.DIV({
    "class": "ags-main-content"
  }, " \n		", Spacebars.include(view.lookupTemplate("mainContent")), "\n		"), "\n	");
}));

})();
