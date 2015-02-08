(function(){
Template.__checkName("agsLogin");
Template["agsLogin"] = new Template("Template.agsLogin", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ags-login"
  }, "\n		", Blaze._TemplateWith(function() {
    return {
      align: Spacebars.call("left")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("loginButtons"));
  }), "\n	");
}));

})();
