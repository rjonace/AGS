Meteor.publish('thePlayers', function (){
	var currentUserId = this.userId;
	return PlayerList.find({createdBy: currentUserId});
});