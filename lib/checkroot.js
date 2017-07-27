/**
 * check current working directory whether is root directory of blog
 */

const fse = require('fs-extra');
const logger = require('./logger');
const cwd = process.cwd();

function check() {
	// root directory must have 'config.yml', 'public' and 'source'
	if (!fse.existsSync('./config.yml') || !fse.existsSync('./public') || !fse.existsSync('./source')) {
		logger.error(`not in root directory: ${cwd}`);
		process.exit();
	}
}

module.exports = { check };