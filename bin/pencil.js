#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const help = require('./help');
let argvs = process.argv.slice(2);
if (argvs.length === 0) {
	help.help();
	process.exit();
}
else if (fse.existsSync(path.join(__dirname, `./${argvs[0]}.js`))) {
	const command = require(`./${argvs[0]}`);
	argvs = argvs.slice(1);
	command.runner(argvs);
}
else {
	help.help();
	process.exit();
}

module.exports = {
	tips: '这是一个命令行程序，使用前请先全局安装，`npm install pencil-cli -g`'
};
