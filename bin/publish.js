/*
 * 发布草稿
 * @Author: zhouzh1 
 * @Date: 2019-05-18 23:09:37 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:37:22
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const yaml = require('js-yaml');
const logger = require('../lib/logger');

function help () {
	console.log('使用方法: pencil publish <draftType> <draftTitle>');
	console.log('功能描述: 发布草稿');
	console.log('<draftType>:');
	console.log('  * article: 文章草稿');
	console.log('  * page: 页面草稿');
	console.log('<draftTitle>: 草稿标题');
}

/**
 * publish description
 * @param  {[type]} type  article or page
 * @param  {[type]} title title of draft
 */
function publish(type, title) {
	let draftname = title.split(' ').join('-');
	let draft = `./source/draft/${type}/${draftname}.md`;
	if (!fse.existsSync(draft)) {
		logger.error(`没有这篇草稿: ${title}`);
	}
	else {
		let source = fse.readFileSync(draft, 'utf8');
		let frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
		let result = frontmatterRegExp.exec(source);
		let frontmatter = yaml.safeLoad(result[1]);
		let filename = frontmatter.filename || title;
		if (fse.existsSync(`./public/${type}/${filename.split(' ').join('_')}.html`)) {
			logger.error(`文件名重复: ${filename}`);
		}
		else {
			let formal = `./source/${type}/${draftname}.md`;
			fse.moveSync(draft, formal);
			logger.log('发布成功');
		}
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
			case 'article':
			case 'page':
				publish(type, title);
				break;
			default:
				help();
				break;
		}
	}
	process.exit();
}

module.exports = { help, runner };