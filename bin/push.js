/**
 * push to remote server by using git
 */

const exec = require('child_process').exec;
const path = require('path');
const logger = require(path.join(__dirname, '../lib/logger'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const EOL = require('os').EOL;

/**
 * show help info about push command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil push${EOL}`);
	console.log('  Description:');
	console.log('    push to remote server by using git');
}

function runner () {
	if (!checkroot.isRootDir()) {
		return 1;
	}
	else { 
		var options = { encoding: 'utf8' };
		console.log('checking......');
		exec('git status', options, function (error, stdout, stderr) {	// git status
			if (error) {
				logger.error(stderr);
			}
			else {
				console.log('adding......');
				exec('git add *', options, function (error, stdout, stderr) {	// git add
					if (error) {
						logger.error(stderr);
					}
					else {
						console.log('committing......');
						exec(`git commit -m "push at ${new Date().getUTCString()}"`, options, function (error, stdout, stderr) {	// git commit
							if (error) {
								logger.error(stderr);
							}
							else {
								console.log('pushing......');
								exec('git push', options, function (error, stdout, stderr) {	// git push
									if (error) {
										logger.error(stderr);
									}
									else {
										logger.info(stdout);
									}
								});
							}
						});
					}
				});
			}
		});
	}
}

module.exports = {help, runner};



