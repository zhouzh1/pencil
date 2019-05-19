/*
 * 删除文件
 * @Author: zhouzh1 
 * @Date: 2019-05-19 00:24:57 
 * @Last Modified by: zhouzh1
 * @Last Modified time: 2019-05-19 17:46:09
 */


if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const yaml = require('js-yaml');
const repl = require('repl');
const logger = require('../lib/logger');
const EOL = require('os').EOL;

const frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;

function help() {
	console.log('使用方法: pencil delete <type> <title>');
	console.log('功能描述: 删除草稿或已经发布的文章和页面');
	console.log('<type>:');
	console.log('  * draft-article: 文章草稿');
	console.log('  * draft-page: 文章草稿');
	console.log('  * article: 文章');
	console.log('  * page: 页面');
	console.log('<title> 文件标题');
}

function eval(cmd, context, filename, callback) {
	if (cmd === `yes${EOL}`) {
		// input 'yes', delete
		fse.removeSync(context.markdown);
		logger.log('删除成功');
		// if exist html file, remove it and re-generate
		let html = context.html;
		if (html && fse.existsSync(html)) {
			logger.log('开始重新构建站点...');
			require('./generate').runner([]);
		}
		process.exit();
	}
	else if (cmd === `no${EOL}`) {
		// input 'no', exit
		process.exit();
	}
	else {
		callback();
	}
}

function remove(type, title) {
	// check if exist such article or page
	let fragments = type.split('-');
	let markdown = `./source/${fragments.join('/')}/${title.split(' ').join('-')}.md`;
	let html = null;
	if (!fse.existsSync(markdown)) {
		logger.error(`没有此文件：${fragments.reverse().join(' ')}: ${title}`);
		process.exit();
	}
	else if (fragments[0] !== 'draft') {
		// get path of html file
		let source = fse.readFileSync(markdown, 'utf8');
		let frontmatter = yaml.safeLoad(frontmatterRegExp.exec(source)[1]);
		let filename = (frontmatter.filename || frontmatter.title).split(' ').join('-');
		html = `./public/${type}/${filename}.html`;
	}
	let options = {
		prompt: '删除后无法恢复，确定删除吗? (yes or no)',
		eval: eval
	};
	// wait to confirm
	let r = repl.start(options);
	r.context.markdown = markdown;
	r.context.html = html;
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
			case 'darft-page':
			case 'article':
			case 'page':
				remove(type, title);
				break;
			default:
				help();
				break;
		} 
	}
}

module.exports = { help, runner };