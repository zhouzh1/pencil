/**
 * help comamnd
 */

const path = require('path');
const fse = require('fs-extra');

function help () {
	console.log('Usage: pencil <command>');
	console.log('  Commands:');
	console.log('       help: show help information');
	console.log('       init: initiate a new blog');
	console.log('     create: create a new draft');
	console.log('    publish: publish draft');
	console.log('   generate: generate all static pages');
	console.log('     server: start local server to preview');
	console.log('       edit: open default editor to edit markdown');
	console.log('       list: list drafts, articles and pages');
	console.log('     delete: delete drafts, articles and pages');
	console.log('     deploy: deploy to remote server');
}

/**
 * show help information for every command
 * @param  {[Array]} argvs [command name]
 */
function runner (argvs) {
	if (argvs.length != 1) {
		help();
	}
	else if (fse.existsSync(path.join(__dirname, `./${argvs[0]}.js`))) {
		if (argvs[0] === 'help') {
			help();
		}
		else {
			require(`./${argvs[0]}`);
		}
	}
	else {
		help();
	}
	process.exit();
}

module.exports = { help, runner };

