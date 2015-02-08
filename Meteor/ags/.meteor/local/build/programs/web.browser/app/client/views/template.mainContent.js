(function(){
Template.__checkName("mainContent");
Template["mainContent"] = new Template("Template.mainContent", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "ags-main-content-info"
  }, "\n			", HTML.Raw("<h2>Your courses</h2>"), "\n				", HTML.UL("\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("userCourseList"));
  }, function() {
    return [ "\n						", HTML.LI({
      "class": ""
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("number"));
    }), ": ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("name"));
    })), "\n					" ];
  }), "\n				"), "\n			"), HTML.Raw('\n\n			<div class="ags-main-content-view">\n				<ul>\n					<li><a href="COP3502_New.html">Create Assignment</a></li>\n					<li><a href="COP3502_1.html">Assignment 1</a><br></li>\n					<li><a href="COP3502_2.html">Assignment 2</a><br></li>\n					<li><a href="COP3502_3.html">Assignment 3</a><br></li>\n					<li><a href="COP3502_4.html">Assignment 4</a><br></li>\n				</ul>\n			</div>') ];
}));

})();
