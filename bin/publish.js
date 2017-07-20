/**
 * publish command
 */

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const yaml = require('js-yaml');
const EOL = require('os').EOL;
const logger = require('../lib/logger');
const processargvs = require('../lib/processargvs');

function help () {
	console.log(`Usage: pencil publish [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    publish draft');
	console.log('  Arguments:');
	console.log('    [type]  article or page');
	console.log('    <title> title of draft');
}

function runner (argvs) {
	let { type, title } = processargvs(argvs, help);
	let draftname = title.split(' ').join('_');
	let draft = `./source/draft/${type}/${draftname}.md`;
	if (!fse.existsSync(draft)) {
		logger.error(`no such draft: ${title}`);
		process.exit();
	}
	else {
		let source = fse.readFileSync(draft, 'utf8');
		let frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
		let result = frontmatterRegExp.exec(source);
		let frontmatter = yaml.safeLoad(result[1]);
		let filename = frontmatter.filename || title;
		if (fse.existsSync(`./public/${type}/${filename.split(' ').join('_')}.html`)) {
			logger.error(`duplicate filename: ${filename}`);
			process.exit();
		}
		else {
			let formal = `./source/${type}/${draftname}.md`;
			fse.moveSync(draft, formal);
		}
	}
}

module.exports = { help, runner };