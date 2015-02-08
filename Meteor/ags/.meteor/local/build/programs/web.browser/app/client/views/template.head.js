(function(){
Template.__checkName("agsHead");
Template["agsHead"] = new Template("Template.agsHead", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ags-head"
  }, HTML.Raw('\n		<div class="ags-head-logo">\n			<img src="images/headlogo.png" height="32px" width="32px">\n		</div>\n<!--	<div class=ags-head-breadcrumb></div> -->\n		'), HTML.DIV({
    "class": "ags-head-acct"
  }, "\n			", Spacebars.include(view.lookupTemplate("loginButtons")), "\n		"), "\n	");
}));

})();
