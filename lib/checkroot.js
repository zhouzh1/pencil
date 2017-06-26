/**
 * Check the current working directory whether is root of blog instance
 */

const fse = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const cwd = process.cwd();

function isRootDir() {
	let configFile = path.join(cwd, './config.yml');
	if (!fse.existsSync(configFile)) {
		logger.error('Could not find config.yml, please ensure current working directory is the root path of your blog');
		return false;
	}
	else {
		return true;
	}
}

module.exports = {isRootDir};