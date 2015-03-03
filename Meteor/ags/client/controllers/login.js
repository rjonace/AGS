// Template.loginButtons.rendered = function(){
// 	if (!Meteor.userId()){
// 	    Accounts._loginButtonsSession.set('dropdownVisible', true);
// 	}
// };

Template.agsLogin.rendered = function () {
 
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
						alert(error);
				});
  			} else {
  				alert("No password entered.");
  			} 
  		} else {
  				alert("No email entered.");
  		}
  	},
  	'click .ui.button.create.account' : function(e){
  		var email = $('#signinEmailField').val()
  		var pass = $('#signinPasswordField').val()

  		if (email != "") {
  			if( pass != "") {
				  Accounts.createUser({email: email, password: pass},function(error){
					if(error)
						alert(error);
				});
  			} else {
  				alert("No password entered.");
  			} 
  		} else {
  				alert("No email entered.");
  		}
  		console.log('createaccount');
  	}
  });

}