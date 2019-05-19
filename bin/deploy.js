/*
 * 部署站点到远程服务器
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:51:11 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 22:45:05
 */

const logger = require('../lib/logger');

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const { spawn } = require('child_process');

// options for spawn
const options = {
	stdio: 'inherit'
};

function help() {
	console.log('使用方法: pencil push');
	console.log('功能描述: 将站点部署到线上服务器');
}

function runner() {
	// git pull origin source:source
	// git status
	// git add -A
	// git commit -m `${time}`
	// git push origin source:source
	// git subtree push --prefix public origin master
	logger.info('git pull origin source:source');
	const pull = spawn('git', ['pull', 'origin', 'source:source'], options);
	pull.on('close', function (code) {
		if (code === 0) {
			logger.info('git status');
			const status = spawn('git', ['status'], options);
			status.on('close', function (code) {
				if (code === 0) {
					logger.info('git add -A');
					const add = spawn('git', ['add', '-A'], options);
					add.on('close', function (code) {
						if (code === 0) {
							logger.info('git commit');
							const commit = spawn('git', ['commit', '-m', (new Date()).toLocaleString()], options);
							commit.on('close', function (code) {
								if (code === 0) {
									logger.info('git push origin source:source');
									const sourceBranch = spawn('git', ['push', 'origin', 'source:source'], options);
									sourceBranch.on('close', function (code) {
										if (code === 0) {
											logger.info('git subtree push --prefix public origin master');
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



