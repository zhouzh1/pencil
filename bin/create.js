/*
 * 创建草稿
 * @Author: zhouzh1 
 * @Date: 2019-05-19 00:29:44 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:47:33
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const open = require('opn');
const moment = require('moment');
const logger = require('../lib/logger');

function help() {
	console.log('使用方法: pencil create <type> <title>');
	console.log('功能描述: 创建一篇新的草稿');
	console.log('<type>:');
	console.log('  * article: 文章草稿');
	console.log('  * page: 页面草稿');
	console.log('<title> 草稿标题');
}

/**
 * create function
 * @param  {[type]} type  article or page
 * @param  {[type]} title title of draft
 */
function create(type, title) {
	let frontmatter;
	if (type === 'article') {
		frontmatter = `---
title: ${title}
tags: []
category:
filename:
createdTime: ${moment().format('YYYY-MM-DD HH:mm')}
---`;
	}
	else {
		frontmatter = `---
title: ${title}
filename:
createdTime: ${moment().format('YYYY-MM-DD HH:mm')}
---`;
	}
	// replace spaces between words with '-'
	let filename = title.split(' ').join('-');
	let draft = `./source/draft/${type}/${filename}.md`;
	let formal = `./source/${type}/${filename}.md`;
	if (fse.existsSync(draft) || fse.existsSync(formal)) {
		logger.error(`此草稿已经存在: ${title}`);
	}
	else {
		fse.outputFileSync(draft, frontmatter);
		logger.info('创建成功');
		// open default editor
		open(draft);
	}
}

/**
 * create a new draft
 * @param  {[Array]} argvs [type and title of draft]
 */
function runner (argvs) {
	if (argvs.length !== 2) {
		help();
	}
	else {
		let type = argvs[0];
		let title = argvs[1];
		switch(type) {
			case 'article':
			case 'page':
				create(type, title);
				break;
			default:
				help();
				break;
		}
	}
	process.exit();
}

module.exports = { help, runner };
