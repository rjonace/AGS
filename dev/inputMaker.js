//for basketball.c



var RandExp = require('randexp'),
	writeFile	= require('fs').writeFile;
	numOfCases = new RandExp(/^\d{1,5}$/).gen(),
	sampleInput = "";

sampleInput += numOfCases+'\n';

for(var i = 0; i < numOfCases; i++) {
	var caseHead = new RandExp(/^[1-9]\d{0,2} [1-9]\d{0,2} [1-9]$/).gen(),
		numOfLines = caseHead.split(' ')[0];
	sampleInput += caseHead+'\n';
	for(var j = 0; j < numOfLines; j++) {
		var line = new RandExp(/^[A-Z]{1}[a-z]{3,10} \d{1,3} [1-9]\d{0,2}$/).gen();
		sampleInput += line+'\n'
	}
}

console.log(sampleInput);
writeFile('basketballgame_random3.in',sampleInput);


