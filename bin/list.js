/**
 * list command
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
	console.log('Usage: pencil list [type]');
	console.log('  Description:');
	console.log('    list drafts, articles and pages');
	console.log('  Arguments:');
	console.log('               --  list all drafts, articles and pages');
	console.log('    draft-article  list article drafts');
	console.log('       draft-page  list page drafts');
	console.log('          article  list articles');
	console.log('             page  list pages');
}

function list(dir) {
	const files = fse.readdirSync(dir);
	if (files.length > 0) {
		for (let file of files) {
			let title = path.parse(file).name.split('_').join(' ');
			console.log(`  ${title}`);
		}
	}
	else {
		console.log('  no files');
	}
}

function listDraftArticle() {
	console.log('Article drafts:');
	list('./source/draft/article');
}

function listDraftPage() {
	console.log('Page drafts:');
	list('./source/draft/page');
}

function listArticle() {
	console.log('Articles:');
	list('./source/article');
}

function listPage() {
	console.log('Pages:');
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