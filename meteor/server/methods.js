Meteor.methods({				
	'numberOfFilesInDirectory': function (dirName) {
		var readdir = Npm.require('fs').readdir;
		var numFiles = readdir(dirName).length;
		console.log("number of files: " +numFiles);
		return numFiles;
	}
})