(function(){Template.loginButtons.rendered = function(){
	if (!Meteor.userId()){
	    Accounts._loginButtonsSession.set('dropdownVisible', true);
	}
};

})();
