Template.leaderboardlist.helpers({
	'player': function(){
		var currentUserId = Meteor.userId();
		return PlayerList.find({}, {sort: {score: -1, name: 1} });
	},
	'playerCount': function(){
		var currentUserId = Meteor.userId();
		return PlayerList.find().count();
	},
	'selectedClass': function(){
		var playerId = this._id;
		var selectedPlayer = Session.get('selectedPlayer');
		if(playerId == selectedPlayer){
			return "selected";
		}
	},
	'showSelectedPlayer': function(){
		var selectedPlayer = Session.get('selectedPlayer');
		return PlayerList.findOne(selectedPlayer);
	}
});

Template.leaderboardlist.events({
	'click .player': function(){
		var selectedPlayer = Session.get('selectedPlayer');
		var playerId = this._id;
		if(playerId != selectedPlayer){
			Session.set('selectedPlayer', playerId);
		}
		else{
			Session.set('selectedPlayer', null);
		}
	},

	'click .increment': function(){
		var selectedPlayer = Session.get('selectedPlayer');
		Meteor.call('modifyPlayerScore', selectedPlayer, 5);
	},

	'click .decrement': function(){
		var selectedPlayer = Session.get('selectedPlayer');
		Meteor.call('modifyPlayerScore', selectedPlayer, -5);
	},

	'click .remove': function(){
		var selectedPlayer = Session.get('selectedPlayer');
		Meteor.call('removePlayerData', selectedPlayer);
		Session.set('selectedPlayer', null);
	}
});