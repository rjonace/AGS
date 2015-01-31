PlayerList = new Mongo.Collection('players');

if(Meteor.isClient){
	console.log("\nHello client\n");

	Template.leaderboard.helpers({
		'player': function(){
			return PlayerList.find({}, {sort: {score: -1, name: 1} });
		},
		'playerCount': function(){
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

	Template.leaderboard.events({
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
			PlayerList.update(selectedPlayer, {$inc: {score: 5}});
		},

		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.update(selectedPlayer, {$inc: {score: -5}});
		},

		'click .remove': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.remove(selectedPlayer);
		}
	});

	Template.addPlayerForm.events({
		'submit form': function(event){
			event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			PlayerList.insert({name: playerNameVar, score: 0});

			fileStuff = event.target.test.files;

		}
	})
}

if(Meteor.isServer){
	console.log("\nHello server\n");
}