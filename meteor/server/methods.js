Meteor.methods({				
	'numberOfFilesInDirectory': function (dirName) {
		var readdirSync = Npm.require('fs').readdirSync;
		var numFiles = readdirSync(dirName).length;
		console.log("number of files: " +numFiles);
		return numFiles;
	}
})