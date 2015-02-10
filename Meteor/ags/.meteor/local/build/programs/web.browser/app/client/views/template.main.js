(function(){
Template.__checkName("agsMain");
Template["agsMain"] = new Template("Template.agsMain", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ags-main"
  }, "\n		", HTML.DIV({
    "class": "ags-main-nav"
  }, "\n		", Spacebars.include(view.lookupTemplate("mainNav")), "\n		"), "\n\n		", HTML.DIV({
    "class": "ags-main-content"
  }, " \n		", Spacebars.include(view.lookupTemplate("mainContent")), "\n		"), "\n	");
}));

})();
