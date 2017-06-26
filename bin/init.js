/**
 * Initiate a new blog structure
 */
const path = require('path');
const fse = require('fs-extra');
const logger = require(path.join(__dirname, '../lib/logger'));
const cwd = process.cwd();
const EOL = require('os').EOL;

/**
 * Get help information about command 'init'
 */
function help () {
	console.log(`Usage: pencil init <path>${EOL}`);
	console.log('  Description:');
	console.log('    initiate a new blog, which will build corresponding directory structure for you');
	console.log('  Arguments:');
	console.log('    <path>  an absolute or relative path for your blog');
}

/**
 * Initiate a new blog
 * @param  {Array} argvs argvs.length must be 1 and argvs[0] is the absolute or relative path for new blog
 */
function runner (argvs) {
	if (argvs.length == 1) {
		let root = argvs[0];
		try {
			if (fse.existsSync(root) && fse.readdirSync(root).filter((ele) => { return ele != '.git'; }).length) {
				logger.error(`${root} is not empty`);
			}
			else {
				fse.copySync(path.join(__dirname, '../scaffcolding'), root);
				logger.info(`the new blog is initiated successfully in ${root}`);
			}
		}
		catch (error) {
			logger.fatal(error.toString());
		}
	}
	else {
		help();
	}
}

module.exports = {help, runner};