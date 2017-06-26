/**
 * Create a new article or page
 */
const fse = require('fs-extra');
const path = require('path');
const moment = require('moment');
const processargvs = require(path.join(__dirname, '../lib/processargvs'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const logger = require(path.join(__dirname, '../lib/logger'));
const EOL = require('os').EOL;
const cwd = process.cwd();

/**
 * Get help information about command 'create'
 */
function help () {
	console.log(`Usage: pencil create [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    create a new article or page, but it is just a draft');
	console.log('  Arguments:');
	console.log('    [type]  The type of new entry, \'article\' or \'page\', default is \'article\'');
	console.log('    <title>  The title of new entry, it will be the filename of draft, if it contains spaces, it must be wrapped by quotation marks');
} 

/**
 * Create a draft
 * @param  {[Array]} argvs [including type and title of draft]
 * @return {[type]}         [description]
 */
function runner (argvs) {
	if (checkroot.isRootDir()) {
		var {type, title} = processargvs(argvs, help);
		moment.locale('en');
		var frontMeta = `---
title: ${title}
filename:
${type === 'article' ? 'tags: []' : ''}
${type === 'article' ? 'category:' : ''}
createdDate: ${moment().format('YYYY-MM-DD HH:mm')}
---`;
		var draft = path.join(cwd, `./source/draft/${type}/${title}.md`);
		var formal = path.join(cwd, `./source/${type}/${title}.md`);
		if (fse.existsSync(draft) || fse.existsSync(formal)) {
			logger.warn(`there is already a ${type} draft whose title is ${title}`);
		}
		else {
			fse.writeFile(draft, frontMeta, (err) => {
				if (err) {
					logger.error(err.toString());
				}
				else {
					logger.info('the draft is created successfully');
				}
			});
		}
	}
}

module.exports = {help, runner};
