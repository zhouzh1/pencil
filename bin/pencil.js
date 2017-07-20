/**
 * entry point
 */
const fse = require('fs-extra');
const help = require('./help');
let argvs = process.argv.slice(2);
if (argvs.length === 0) {
	help.help();
	process.exit();
}
else if (fse.existsSync(`./${argvs[0]}.js`)) {
	const command = require(`./${argvs[0]}`);
	argvs = argvs.slice(1);
	command.runner(argvs);
}
else {
	help.help();
	process.exit();
}
