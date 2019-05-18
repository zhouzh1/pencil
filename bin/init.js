/*
 * 初始化站点结构
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:31:43 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-18 23:35:46
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const path = require('path');
const fse = require('fs-extra');
const logger = require('../lib/logger');

/**
 * init command
 */
function help () {
	console.log('pencil init <dir>');
	console.log('初始化一个新的Blog站点');
	console.log('<dir> 空目录路径');
}

/**
 * intiate a new blog
 * @param  {[type]} argvs [path for new blog]
 */
function runner (argvs) {
	if (argvs.length === 1) {
		let root = argvs[0];
		if (fse.existsSync(root) && fse.readdirSync(root).filter((ele) => { return ele != '.git'; }).length) {
			logger.error(`非空目录: ${root}`);
		}
		else {
			fse.copySync(path.join(__dirname, '../scaffolding'), root);
			logger.info(`初始化成功，请将工作目录切换至${root}`);
		}
		process.exit();
	}
	else {
		help();
		process.exit();
	}
}

module.exports = { help, runner };