/**
 * create command
 */

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const path = require('path');
const moment = require('moment');
const processargvs = require('../lib/processargvs');
const logger = require('../lib/logger');
const EOL = require('os').EOL;

function help () {
	console.log(`Usage: pencil create [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    create a new draft');
	console.log('  Arguments:');
	console.log('    [type]   article or page');
	console.log('    <title>  title of draft');
} 

/**
 * create a new draft
 * @param  {[Array]} argvs [type and title of draft]
 */
function runner (argvs) {
	let { type, title } = processargvs(argvs, help);
	let frontmatter = `---
title: ${title}
filename:
${type === 'article' ? 'tags: []' : ''}
${type === 'article' ? 'category:' : ''}
createdTime: ${moment().format('YYYY-MM-DD HH:mm')}
---`;
	// replace spaces between words with '_'
	let filename = title.split(' ').join('_');
	let draft = `./source/draft/${type}/${filename}.md`;
	let formal = `./source/${type}/${filename}.md`;
	if (fse.existsSync(draft) || fse.existsSync(formal)) {
		logger.error(`duplicate title: ${title}`);
		process.exit();
	}
	else {
		fse.outputFileSync(draft, frontmatter);
		console.log('successfully!');
	}
}

module.exports = { help, runner };
