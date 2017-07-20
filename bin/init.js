/**
 * Init Command
 */

const path = require('path');
const fse = require('fs-extra');
const logger = require('../lib/logger');
const EOL = require('os').EOL;

/**
 * init command
 */
function help () {
	console.log(`Usage: pencil init <path>${EOL}`);
	console.log('  Description:');
	console.log('    initiate a new blog');
	console.log('  Arguments:');
	console.log('    <path>  an absolute or relative path');
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