/*
 * 开启本地预览服务器
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:08:01 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-18 23:31:33
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const open = require('opn');
const express = require('express');
const logger = require('../lib/logger');

function help () {
	console.log('pencil server [port=3000]');
	console.log('开启本地预览服务器，默认端口3000');
}

/**
 * start a express app to preview your site
 * @param  {[Array]} argvs [port that server will be listening on]
 */
function runner (argvs) {
	if (argvs.length > 1) {
		help();
		process.exit();
	}
	else if (argvs.length === 1 && (isNaN(Number(argvs[0])) || Number(argvs[0]) < 0 || Number(argvs[0]) >= 65536)) {
		logger.error('端口必须在[0, 65536]之间');
		process.exit();
	}
	else {
		let port = argvs[0] ? Number(argvs[0]) : 3000;
		let app = express();
		// set './public' as '/www' of server
		app.use(express.static('public'));
		app.listen(port, function() {
			logger.log('本地预览服务启动成功...');
			// open default browser
			open(`http://localhost:${port}`);
		});
	}
}

module.exports = { help, runner };

