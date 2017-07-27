/**
 * edit command
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
	console.log('Usage: pencil edit <type> <title>');
	console.log('  Description:');
	console.log('    open default editor to edit markdown');
	console.log('  Arguments:');
	console.log('    <title>  title of item');
	console.log("     <type>  one of ['draft-article', 'draft-page', 'article', 'page']");
}


function edit(fragment, title) {
	let filename = title.split(' ').join('_');
	let markdown = `./source/${fragment}/${filename}.md`;
	if (!fse.existsSync(markdown)) {
		let type = fragment.split('/').reverse().join(' ');
		logger.error(`no such ${type}: ${title}`);
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