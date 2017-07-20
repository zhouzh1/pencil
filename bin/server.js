/**
 * server command
 */

const checkroot = require('../lib/checkroot');
checkroot.check();

const express = require('express');
const logger = require('../lib/logger');
const EOL = require('os').EOL;


function help () {
	console.log(`Usage: pencil server${EOL}`);
	console.log('  Description:');
	console.log('    start local server to preview');
	console.log('  Arguments:');
	console.log('    [port]  the port server is listening on, default is 3000');
}

/**
 * start a express app to preview your site
 * @param  {[Array]} argvs [port that server will be listening on]
 */
function runner (argvs) {
	if (argvs.length > 1) {
		help();
		process.exit();
	}
	else if (argvs.length === 1 && (isNaN(Number(argvs[0])) || Number(argvs[0]) < 0 || Number(argvs[0]) >= 65536)) {
		logger.error('port argument must be >= 0 and < 65536');
		process.exit();
	}
	else {
		let port = argvs[0] ? Number(argvs[0]) : 3000;
		let app = express();
		// set './public' as '/www' of server
		app.use(express.static('public'));
		app.listen(port, function() {
			logger.info(`server is listening on port ${port}...`);
		});
	}
}

module.exports = { help, runner };

