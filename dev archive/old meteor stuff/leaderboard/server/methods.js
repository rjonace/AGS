Meteor.methods({
	'insertPlayerData': function (playerName){
		var currentUserId = Meteor.userId();
		PlayerList.insert({
			name: playerName, 
			score: 0,
			createdBy: currentUserId
		});
	},
	'removePlayerData': function(selectedPlayer){
		PlayerList.remove(selectedPlayer);
	},
	'modifyPlayerScore': function(selectedPlayer, scoreDelta){
		PlayerList.update(selectedPlayer, {$inc: {score: scoreDelta} });
	}
})