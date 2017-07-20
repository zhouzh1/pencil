/**
 * help comamnd
 */

const fse = require('fs-extra');
const EOL = require('os').EOL;

function help () {
	console.log(`Usage: pencil <command>${EOL}`);
	console.log(`Commands:${EOL}`);
	console.log('     help: show usage information');
	console.log('     init: initiate a new blog');
	console.log('   create: create a new draft');
	console.log('  publish: publish draft');
	console.log(' generate: generate all static pages');
	console.log('   server: start local server to preview');
	console.log('     push: push to remote server');
}

/**
 * show help information for every command
 * @param  {[Array]} argvs [command name]
 */
function runner (argvs) {
	if (argvs.length != 1) {
		help();
		process.exit();
	}
	else if (fse.existsSync(`./${argvs[0]}.js`)) {
		const command = require(`./${argvs[0]}`);
		command.help();
	}
	else {
		help();
		process.exit();
	}
}

module.exports = { help, runner };

