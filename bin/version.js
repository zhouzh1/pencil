/**
 * version command
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const pkg = require('../package.json');

function help() {
	console.log('Usage: pencil version');
	console.log('  Description:');
	console.log('    display version');
}

/**
 * show version of program and platform
 * @param  {Array} argvs argvs must be empty
 */
function runner(argvs) {
	if (argvs.length) {
		help();
		process.exit();
	}
	else {
		console.log(`pencil: ${pkg.version}`);
		const versions = process.versions;
		for (var key in versions) {
			console.log(`${key}: ${process.versions[key]}`);
		}
	}
}

module.exports = { help, runner };