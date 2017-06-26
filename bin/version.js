/**
 * Display the version information of pencil
 */
const path = require('path');
const pkg = require(path.join(__dirname, '../package.json'));

/**
 * Get help information about 'version' command
 */
function help () {
	console.log('Usage: pencil version');
	console.log('Description:');
	console.log('Display the version information of pencil');
}

/**
 * Get the version information about pencil and platform
 * @param  {Array} argvs argvs must be empty
 */
function runner (argvs) {
	if (argvs.length) {
		help();
	}
	else {
		console.log(`pencil: ${pkg.version}`);
		for (var key in process.versions) {
			console.log(`${key}: ${process.versions[key]}`);
		}
	}
}

module.exports = {help, runner};