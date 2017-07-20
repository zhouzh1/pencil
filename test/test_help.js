/**
 * test script
 */

const fs = require('fs');
const help = require('../bin/help.js');

const argvs = process.argv.slice(2);

if (argvs.length != 1) {
	help.help();
	process.exit();
}
else {
	const command = argvs[0];
	let executable = `../bin/${command}.js`;
	if (fs.existsSync(executable)) {
		let module = require(executable);
		module.help();
	}
	else {
		help.help();
	}
}


