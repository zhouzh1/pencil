/*
 * 显示程序和运行环境的版本信息
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:05:46 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-18 23:15:50
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const pkg = require('../package.json');

function help() {
	console.log('pencil version');
	console.log('显示程序和运行环境的版本信息');
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