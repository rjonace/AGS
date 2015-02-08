(function(){Template.ags.helpers({
	'currentDashboard': function(){
		 return Session.get('currentDashboard');
	}
});

Template.ags.rendered = function(){
	Session.set('currentDashboard',"userDash");
};

})();
