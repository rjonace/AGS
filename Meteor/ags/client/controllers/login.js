// Template.loginButtons.rendered = function(){
// 	if (!Meteor.userId()){
// 	    Accounts._loginButtonsSession.set('dropdownVisible', true);
// 	}
// };

Template.agsLogin.rendered = function () {
 	$('.ui.error.message').hide();
}

if (Meteor.isClient) {
  Template.agsLogin.helpers({

  });

  Template.agsLogin.events({
  	'click .ui.button.sign.in' : function(e){
  		var email = $('#signinEmailField').val()
  		var pass = $('#signinPasswordField').val()
  		if (email != "") {
  			if( pass != "") {
				Meteor.loginWithPassword(email,pass,function(error){
					if(error)
						$('.ui.error.message').text(error).show();
				});
  			} else {
  				$('.ui.error.message').text("No password entered.").show();
  			} 
  		} else {
  				$('.ui.error.message').text("No email entered.").show();
  		}
  	},
  	'click .ui.button.create.account' : function(e){
  		var email = $('#signinEmailField').val()
  		var pass = $('#signinPasswordField').val()

  		if (email != "") {
  			if( pass != "") {
				  Accounts.createUser({email: email, password: pass},function(error){
					if(error)
						$('.ui.error.message').text(error).show();
				});
  			} else {
  				$('.ui.error.message').text("No password entered.").show();
  			} 
  		} else {
  				$('.ui.error.message').text("No email entered.").show();
  		}

  	}
  });

}