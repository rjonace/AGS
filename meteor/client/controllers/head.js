Template.agsHead.rendered = function() {
	$('.account.popup.tips .ui.button').popup();
}

Template.agsHead.helpers({
	'userEmail': function(){
		return Meteor.user().emails[0];
	}
})

Template.agsHead.events({
	'click .ui.icon.sign.out.button' : function(){
		Meteor.logout(function(error){
			if(error)
				alert(error);
			else {
				Session.keys = {};
				Session.set('currentDashboard', 'userDash');
			}

		});
	},
	'click .ui.icon.settings.button' : function(){
		alert("These should be some settings!");
	}
})