/**
 * push command
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const { spawn } = require('child_process');
const { EOL } = require('os');

// options for spawn
const options = {
	stdio: 'inherit'
};

function help () {
	console.log('Usage: pencil push');
	console.log('  Description:');
	console.log('    push to remote server by git');
}

function runner () {
	// git status
	// git add -A
	// git commit -m `${time}`
	// git push origin master
	// git subtree push --prefix public origin pages
	console.log(`${EOL}### git status ###`);
	const status = spawn('git', ['status'], options);
	status.on('close', function(code){
		if (code === 0) {
			console.log(`${EOL}### git add -A ###`);
			const add = spawn('git', ['add', '-A'], options);
			add.on('close', function(code){
				if (code === 0) {
					console.log(`${EOL}### git commit -m $CURRENT_TIME ###`);
					const commit = spawn('git', ['commit', '-m', (new Date()).toLocaleString()], options);
					commit.on('close', function(code){
						if (code === 0) {
							console.log(`${EOL}### git push origin master:source ###`);
							const sourceBranch = spawn('git', ['push', 'origin', 'master:source'], options);
							sourceBranch.on('close', function(code){
								if (code === 0) {
									console.log(`${EOL}### git subtree push --prefix public origin master ###`);
									spawn('git', ['subtree', 'push', '--prefix', 'public', 'origin', 'master'], options);
								}
							});
						}
					});
				}
			});
		}
	}); 
}

module.exports = { help, runner };



