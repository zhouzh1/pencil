/**
 * push command
 */

const checkroot = require('../lib/checkroot');
checkroot.check();

const exec = require('child_process').exec;
const logger = require('../lib/logger');
const EOL = require('os').EOL;

/**
 * show help info about push command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil push${EOL}`);
	console.log('  Description:');
	console.log('    push to remote server by git');
}

function runner () {
	const options = { encoding: 'utf8' };
	console.log('checking...');
	exec('git status', options, function (error, stdout, stderr) {
		if (error) {
			logger.error(stderr);
			process.exit();
		}
		else {
			console.log('adding...');
			exec('git add *', options, function (error, stdout, stderr) {
				if (error) {
					logger.error(stderr);
					process.exit();
				}
				else {
					console.log('committing...');
					exec(`git commit -m "push at ${new Date().getUTCString()}"`, options, function (error, stdout, stderr) {
						if (error) {
							logger.error(stderr);
							process.exit();
						}
						else {
							console.log('pushing...');
							exec('git push', options, function (error, stdout, stderr) {
								if (error) {
									logger.error(stderr);
								}
								else {
									logger.info(stdout);
								}
								process.exit();
							});
						}
					});
				}
			});
		}
	});
}

module.exports = { help, runner };



