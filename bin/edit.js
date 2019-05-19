/*
 * 通过文件类型和文件名来使用默认编辑器编辑文件
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:48:29 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:43:24
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const open = require('opn');
const logger = require('../lib/logger');

function help() {
	console.log('使用方法: pencil edit <type> <title>');
	console.log('功能描述: 打开默认编辑器编辑指定文件');
	console.log('<type>:');
	console.log('  * draft-article: 文章草稿');
	console.log('  * draft-page: 文章草稿');
	console.log('  * article: 文章');
	console.log('  * page: 页面');
	console.log('<title> 文件标题');
}


function edit(fragment, title) {
	let filename = title.split(' ').join('-');
	let markdown = `./source/${fragment}/${filename}.md`;
	if (!fse.existsSync(markdown)) {
		let type = fragment.split('/').reverse().join(' ');
		logger.error(`没有该文件: ${type}|${title}`);
	}
	else {
		open(markdown);
	}
}

function runner(argvs) {
	if (argvs.length !== 2) {
		help();
	}
	else {
		let type = argvs[0];
		let title = argvs[1];
		switch(type) {
			case 'draft-article':
				edit('draft/article', title);
				break;
			case 'draft-page':
				edit('draft/page', title);
				break;
			case 'article':
				edit('article', title);
				break;
			case 'page':
				edit('page', title);
				break;
			default:
				help();
				break;
		}
	}
	process.exit();
}

module.exports = { help, runner };