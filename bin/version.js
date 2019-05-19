/*
 * 显示程序和运行环境的版本信息
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:05:46 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:49:18
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const pkg = require('../package.json');

function help() {
	console.log('使用方法: pencil version');
	console.log('功能描述: 显示程序和运行环境的版本信息');
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