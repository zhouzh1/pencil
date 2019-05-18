/*
 * 展示帮助信息
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:35:57 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-18 23:39:51
 */


const path = require('path');
const fse = require('fs-extra');

function help () {
	console.log('pencil <command>');
	console.log('command:');
	console.log('help: 展示帮助信息');
	console.log('init: 初始化新的Blog站点');
	console.log('create: 创建一篇新的草稿');
	console.log('publish: 发布草稿');
	console.log('generate: 生成静态Html页面');
	console.log('server: 开启本地预览服务');
	console.log('edit: 使用系统默认编辑器编辑文件');
	console.log('list: 展示文件列表');
	console.log('delete: 删除文件');
	console.log('deploy: 将Blog站点部署都远程服务器');
}

/**
 * show help information for every command
 * @param  {[Array]} argvs [command name]
 */
function runner (argvs) {
	if (argvs.length != 1) {
		help();
	}
	else if (fse.existsSync(path.join(__dirname, `./${argvs[0]}.js`))) {
		if (argvs[0] === 'help') {
			help();
		}
		else {
			require(`./${argvs[0]}`);
		}
	}
	else {
		help();
	}
	process.exit();
}

module.exports = { help, runner };

