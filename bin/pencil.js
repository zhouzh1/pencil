/**
 * Entry point
 */
const fse = require('fs-extra');
const path = require('path');
const help = require(path.join(__dirname, './help'));
let argvs = process.argv.slice(2);
if (argvs.length === 0) {
	help.help();
}
else if (fse.existsSync(path.join(__dirname, `${argvs[0]}.js`))) {
	let command = require(path.join(__dirname, `${argvs[0]}`));
	argvs = argvs.slice(1);
	command.runner(argvs);
}
else {
	help.help();
}
