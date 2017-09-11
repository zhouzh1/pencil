/**
 * publish command
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
	console.log('Usage: pencil publish <type> <title>');
	console.log('  Description:');
	console.log('    publish draft');
	console.log('  Arguments:');
	console.log('     <type>  article or page');
	console.log('    <title>  title of draft');
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
		logger.error(`no such draft: ${title}`);
	}
	else {
		let source = fse.readFileSync(draft, 'utf8');
		let frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
		let result = frontmatterRegExp.exec(source);
		let frontmatter = yaml.safeLoad(result[1]);
		let filename = frontmatter.filename || title;
		if (fse.existsSync(`./public/${type}/${filename.split(' ').join('_')}.html`)) {
			logger.error(`duplicate filename: ${filename}`);
		}
		else {
			let formal = `./source/${type}/${draftname}.md`;
			fse.moveSync(draft, formal);
			console.log('[+] successfully!');
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