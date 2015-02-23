Template.ags.helpers({
	'currentDashboard': function(){
		 return Session.get('currentDashboard');
	}
});

Template.ags.rendered = function(){
	Session.keys = {};
	Session.set('currentDashboard',"userDash");
};