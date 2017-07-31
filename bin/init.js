/**
 * Init Command
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const path = require('path');
const fse = require('fs-extra');
const logger = require('../lib/logger');

/**
 * init command
 */
function help () {
	console.log('Usage: pencil init <dir>');
	console.log('  Description:');
	console.log('    initiate a new blog');
	console.log('  Arguments:');
	console.log('    <dir>  an absolute or relative path');
}

/**
 * intiate a new blog
 * @param  {[type]} argvs [path for new blog]
 */
function runner (argvs) {
	if (argvs.length === 1) {
		let root = argvs[0];
		if (fse.existsSync(root) && fse.readdirSync(root).filter((ele) => { return ele != '.git'; }).length) {
			logger.error(`not a empty directory: ${root}`);
		}
		else {
			fse.copySync(path.join(__dirname, '../scaffcolding'), root);
			logger.info(`successfully! now you should switch to ${root}`);
		}
		process.exit();
	}
	else {
		help();
		process.exit();
	}
}

module.exports = { help, runner };