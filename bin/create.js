/**
 * create command
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
	console.log('Usage: pencil create <type> <title>');
	console.log('  Description:');
	console.log('    create a new draft');
	console.log('  Arguments:');
	console.log('     <type>   article or page');
	console.log('    <title>   title of draft');
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
	// replace spaces between words with '_'
	let filename = title.split(' ').join('_');
	let draft = `./source/draft/${type}/${filename}.md`;
	let formal = `./source/${type}/${filename}.md`;
	if (fse.existsSync(draft) || fse.existsSync(formal)) {
		logger.error(`duplicate title: ${title}`);
	}
	else {
		fse.outputFileSync(draft, frontmatter);
		console.log('[+] successfully!');
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
