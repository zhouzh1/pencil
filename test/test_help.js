/**
 *
 * TEST CASE ABOUT HELP COMMAND
 *
 */

const fs = require('fs');
const path = require('path');
const help = require(path.join(__dirname, '../bin/help.js'));

const argvs = process.argv.slice(2);

if (argvs.length != 1) {
	help.help();
}
else {
	const command = argvs[0];
	let executable = path.join(__dirname, `../bin/${command}.js`);
	if (fs.existsSync(executable)) {
		let module = require(executable);
		module.help();
	}
	else {
		help.help();
	}
}


