Meteor.methods({				
	'numberOfFilesInDirectory': function (dirName) {
		var readdirSync = Npm.require('fs').readdirSync;
		var numFiles = readdirSync(dirName).length;
		return numFiles;
	}
})