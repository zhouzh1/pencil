/**
 * check current working directory whether is root directory of blog
 */

const fse = require('fs-extra');
const logger = require('./logger');
const cwd = process.cwd();

function check() {
	if (!fse.existsSync('./config.yml')) {
		logger.error(`not in root directory: ${cwd}`);
		process.exit();
	}
}

module.exports = { check };