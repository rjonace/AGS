(function(){
Template.body.addContent((function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("ags"));
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("ags");
Template["ags"] = new Template("Template.ags", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n		", Spacebars.include(view.lookupTemplate("agsHead")), "\n		", Spacebars.include(view.lookupTemplate("agsMain")), "\n		", Spacebars.include(view.lookupTemplate("agsFoot")), "\n	" ];
  }, function() {
    return [ "\n		", Spacebars.include(view.lookupTemplate("loginButtons")), "\n	" ];
  });
}));

})();
