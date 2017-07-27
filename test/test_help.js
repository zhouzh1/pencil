/**
 * test script
 */

const fs = require('fs');
const path = require('path');
const help = require('../bin/help.js');

const argvs = process.argv.slice(2);

if (argvs.length != 1) {
	help.help();
	process.exit();
}
else {
	const command = argvs[0];
	let executable = path.join(__dirname, `../bin/${command}.js`);
	if (fs.existsSync(executable)) {
		require(executable).help();
	}
	else {
		help.help();
	}
}


