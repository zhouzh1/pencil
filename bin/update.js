/**
 * Update formal post or page
 */

const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const logger = require(path.join(__dirname, '../lib/logger'));
const processargvs = require(path.join(__dirname, '../lib/processargvs'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const convert = require(path.join(__dirname, '../lib/convert'));
const cache = require(path.join(__dirname, '../lib/cache'));
const archive = require(path.join(__dirname, '../lib/archive'));
const tag = require(path.join(__dirname, '../lib/tag'));
const category = require(path.join(__dirname, '../lib/category'));
const index = require(path.join(__dirname, '../lib/index'));
const rss = require(path.join(__dirname, '../lib/rss'));
const EOL = require('os').EOL;
const cwd = process.cwd();

/**
 * Get help info about update command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil update [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    update the article or page which has been built');
	console.log('  Arguments:');
	console.log('    [type]  the type of existed entry, \'article\' or \'page\', default is \'article\'');
	console.log('    <title>  the title of article or page which is to be updated');
	console.log('  Options:');
	console.log('    --all  update whole blog site when theme has been changed');
}

/**
 * process markdown source file
 * @param  {[String]} path  [path of source file]
 * @param  {[String]} type  [type of source file]
 * @param  {[String]} title [title of source file]
 * @return {[Object]}       [meta data of source file]
 */
function processMarkdown (path, type, title) {
	var markdown = fse.readFileSync(path, 'utf8');
	var frontMetaRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
	var result = frontMetaRegExp.exec(markdown);
	var frontMeta = yaml.safeLoad(result[1]);
	var filename = frontMeta.filename || title;
	var html = convert(frontMeta, markdown, type, title);
	if (html !== false) {
		fse.writeFileSync(path.join(cwd, `./public/${type}/${filename}.html`), html);
		return {frontMeta, html};
	}
	else {
		return false;
	}
}

/**
 * update only one article or page
 * @param  {[Array]} argvs [including type and title]
 * @return {[type]}         [description]
 */
function updateOne (argvs) {
	var {type, title} = processargvs(argvs, help);
	var sourceFilePath = path.join(cwd, `./source/${type}/${title}.md`);
	if (!fse.existsSync(sourceFilePath)) {
		logger.error(`could not find a ${type} whose title is ${title}`);
	}
	else {
		logger.info(`updating ${title}......`);
		var ret = processMarkdown(sourceFilePath, type, title);
		if (typeof ret === 'object') {
			var {frontMeta, html} = ret;
			cache.update(title, {filename: frontMeta.filename || title, tags: frontMeta.tags, category: frontMeta.category, content: html});
			tag.generate();
			category.generate();
			archive.generate();
			index.generate();
			rss.generate();
			logger.info('update successfully');
		}
	}
}

/**
 * update all site when theme has been changed
 * @return {[type]} [description]
 */
function updateAll () {
	// update all articles
	var articleSourceDir = path.join(cwd, './source/article');
	var articleSourceFiles = fse.readdirSync(articleSourceDir);
	var articlesLength = articleSourceFiles.length;
	for (var i = 0; i < articlesLength; i++) {
		var articleTitle = articleSourceFiles[i];
		logger.info(`updating ${articleTitle}......`);
		var articlePath = path.join(articleSourceDir, articleTitle);
		var ret = processMarkdown(articlePath, 'article', articleTitle);
		if (typeof ret === 'object') {
			cache.update(articleTitle, {filename: frontMeta.filename || articleTitle, tags: frontMeta.tags, category: frontMeta.category, content: html});
		}
	}
	tag.generate();
	category.generate();
	archive.generate();
	index.generate();
	rss.generate();
	// update all pages
	var pageSourceDir = path.join(cwd, './source/page');
	var pageSourceFiles = fse.readdirSync(path.join(cwd, pageSourceDir));
	var pagesLength = pageSourceFiles.length;
	for (var k = 0; k < pagesLength; k++) {
		var pageTitle = pageSourceFiles[k];
		logger.info(`updating ${pageTitle}......`);
		var pagePath = path.join(pageSourceDir, pageTitle);
		processMarkdown(pagePath, 'page', pageTitle);
	}
	logger.info('update all successfully');
}

/**
 * update content
 * @param  {[Array]} argvs [argvs for command]
 * @return {[type]}         [description]
 */
function runner (argvs) {
	if (!checkroot.isRootDir()) {
		return 1;
	}
	else if (argvs.length == 1 && argvs[0] == '--all') {
		updateAll();
	}
	else {
		updateOne(argvs);
	}
}

module.exports = {help, runner};
