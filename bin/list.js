/*
 * 列出所有的文件
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:16:38 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:32:42
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}
const checkroot = require('../lib/checkroot');
checkroot.check();

const path = require('path');
const fse = require('fs-extra');

function help() {
	console.log('使用方法: pencil list [type]');
	console.log('功能描述: 展示文件列表');
	console.log('[type]:');
	console.log('  * null: 列出所有的草稿、文章、页面');
	console.log('  * draft-article: 列出文章草稿');
	console.log('  * draft-page: 列出页面草稿');
	console.log('  * article: 列出文章');
	console.log('  * page: 列出页面');
}

function list(dir) {
	const files = fse.readdirSync(dir);
	if (files.length > 0) {
		for (let file of files) {
			let title = path.parse(file).name.split('-').join(' ');
			console.log(`    "${title}"`);
		}
	}
	else {
		console.log('列表为空！');
	}
}

function listDraftArticle() {
	console.log('[+] 文章草稿列表:');
	list('./source/draft/article');
}

function listDraftPage() {
	console.log('[+] 页面草稿列表:');
	list('./source/draft/page');
}

function listArticle() {
	console.log('[+] 文章列表:');
	list('./source/article');
}

function listPage() {
	console.log('[+] 页面列表:');
	list('./source/page');
}

function listAll() {
	listDraftArticle();
	listDraftPage();
	listArticle();
	listPage();
}

function runner(argvs) {
	if (argvs.length > 1) {
		help();
	}
	else {
		let type = argvs[0];
		switch(type) {
			// no argument
			case undefined:
				listAll();
				break;
			case 'draft-article':
				listDraftArticle();
				break;
			case 'draft-page':
				listDraftPage();
				break;
			case 'article':
				listArticle();
				break;
			case 'page':
				listPage();
				break;
			// invalid argument
			default:
				help();
				break;
		}
	}
	process.exit();
}

module.exports = { help, runner };