/**
 * Display help information
 */
const fse = require('fs-extra');
const path = require('path');
const EOL = require('os').EOL;

/**
 * Display the overall help information
 */
function help () {
	console.log(`Usage: pencil <command>${EOL}`);
	console.log(`Commands:${EOL}`);
	console.log('    help: get help information about command, for example \'pencil help init\'');
	console.log('    init: initiate a new blog');
	console.log('  create: create a new article or page');
	console.log('   build: build html file');
	console.log('  update: update your article or page');
	console.log('  server: start local test server');
	console.log('    push: push content to remote git server');
}

/**
 * Display the help information about certain command
 * @param  {Array} argvs argvs for command
 */
function runner (argvs) {
	if (argvs.length != 1) {
		help();
	}
	else if (fse.existsSync(path.join(__dirname, `${argvs[0]}.js`))) {
		let command = require(path.join(__dirname, `${argvs[0]}`));
		command.help();
	}
	else {
		help();
	}
}

module.exports = {help, runner};

