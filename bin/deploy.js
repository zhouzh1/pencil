/*
 * 部署站点到远程服务器
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:51:11 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 00:24:12
 */

const logger = require('../lib/logger');

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

function help() {
	console.log('pencil push');
	console.log('将站点部署到线上服务器');
}

function runner() {
	// git pull origin source:source
	// git status
	// git add -A
	// git commit -m `${time}`
	// git push origin source:source
	// git subtree push --prefix public origin master
	logger.log(`${EOL}[+] git pull origin source:source`);
	const pull = spawn('git', ['pull', 'origin', 'source:source'], options);
	pull.on('close', function (code) {
		if (code === 0) {
			logger.log(`${EOL}git status`);
			const status = spawn('git', ['status'], options);
			status.on('close', function (code) {
				if (code === 0) {
					logger.log(`${EOL}git add -A`);
					const add = spawn('git', ['add', '-A'], options);
					add.on('close', function (code) {
						if (code === 0) {
							logger.log(`${EOL}git commit`);
							const commit = spawn('git', ['commit', '-m', (new Date()).toLocaleString()], options);
							commit.on('close', function (code) {
								if (code === 0) {
									logger.log(`${EOL}git push origin source:source`);
									const sourceBranch = spawn('git', ['push', 'origin', 'source:source'], options);
									sourceBranch.on('close', function (code) {
										if (code === 0) {
											logger.log(`${EOL}git subtree push --prefix public origin master`);
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
	});
}

module.exports = { help, runner };


