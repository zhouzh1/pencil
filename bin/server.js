/**
 * start local server to preview
 */

const express = require('express');
const path = require('path');
const logger = require(path.join(__dirname, '../lib/logger'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const EOL = require('os').EOL;

/**
 * show help info about server command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil server${EOL}`);
	console.log('  Description:');
	console.log('    start local server to preview your site');
	console.log('  Arguments:');
	console.log('    [port]  The port that server is listening on, default is 3000');
}

/**
 * start a express app to preview your site
 * @param  {[Array]} argvs [port that server will be listening on]
 * @return {[type]}         [description]
 */
function runner (argvs) {
	if (!checkroot.isRootDir()) {
		return 1;
	}
	else if (argvs.length > 1) {
		help();
	}
	else if (argvs.length == 1 && (isNaN(Number(argvs[0])) || Number(argvs[0]) < 0 || Number(argvs[0]) >= 65536)) {
		logger.error('port argument must be >= 0 and < 65536');
	}
	else {
		var port = argvs[0] ? Number(argvs[0]) : 3000;
		var app = express();
		app.use(express.static('public'));	// The ./public is root directory of server
		app.listen(port, function () {
			logger.info(`The server is listening on port ${port}......`);
		});
	}
}

module.exports = {help, runner};

