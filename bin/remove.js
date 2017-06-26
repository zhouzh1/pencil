/**
 * remove article which has been built
 */
const path = require('path');
const repl = require('repl');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const EOL = require('os').EOL;
const logger = require(path.join(__dirname, '../lib/logger'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const cache = require(path.join(__dirname, '../lib/cache'));
const index = require(path.join(__dirname, '../lib/index'));
const archive = require(path.join(__dirname, '../lib/archive'));
const tag = require(path.join(__dirname, '../lib/tag'));
const category = require(path.join(__dirname, '../lib/category'));
const processargvs = require(path.join(__dirname, '../lib/processargvs'));
const rss = require(path.join(__dirname, '../lib/rss'));
const cwd = process.cwd();

/**
 * get help info about remove command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil remove [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    remove a page or article which has been built');
	console.log('  Arguments:');
	console.log('    [type]   The type of existed entry, \'article\' or \'page\', default is \'article\'');
	console.log('    <title>  The title of article or page which is to be removed');
}

/**
 * remove article
 * @param  {[String]} sourceFile [path of source file]
 * @param  {[String]} title      [title of source file]
 * @return {[type]}            [description]
 */
function removeArticle (sourceFile, title) {
	var cacheJson = cache.getJson();
	var publicFile = path.join(cwd, `./public/article/${cacheJson[title]['filename']}.html`);
	//	remove markdown file and html file
	fse.removeSync(sourceFile);
	fse.removeSync(publicFile);
	cache.remove(title);
	archive.generate();
	tag.generate();
	category.generate();
	index.generate();
	rss.generate();
}

/**
 * remove page
 * @param  {[String]} sourceFile [path of source file]
 * @return {[type]}            [description]
 */
function removePage (sourceFile, title) {
	var markdown = fse.readFileSync(sourceFile, 'utf8');
	var frontMetaRegExp = /^-{3}\n([\s\S]+?)\n-{3}\n/;
	var result = frontMetaRegExp.exec(markdown);
	var frontMeta = yaml.safeLoad(result[1]);
	var filename = frontMeta.filename || title;
	var publicFile = path.join(cwd, `./public/page/${filename}.html`);
	fse.removeSync(sourceFile);
	fse.removeSync(publicFile);
}

/**
 * remove artile
 * @param  {[Array]} argvs [including article's title]
 * @return {[type]}         [description]
 */
function runner (argvs) {
	if (!checkroot.isRootDir()) {
		return 1;
	}
	var {type, title} = processargvs(argvs);
	var sourceFile = path.join(cwd, `./source/${type}/${title}.md`);
	if (!fse.existsSync(sourceFile)) {
		logger.error(`could not find a ${type} whose title is ${title}`);
	}
	else {
		var myEval = function (cmd, context, filename, callback) {
			if (cmd == 'Y\n') {	// enter Y
				switch (type) {
					case 'article':
						removeArticle(sourceFile, title);
						break;
					case 'page':
						removePage(sourceFile, title);
						break;
					default:
						break;
				}
				logger.info('removed successfully');
				process.exit(0);
			}
			else if (cmd == 'N\n') { //	enter N
				process.exit(0);
			}
			else {	// enter other content
				callback(null, cmd);
			}
		};
		var myWriter = function () {
			return 'Please enter Y or N';
		};
		repl.start({prompt: 'Are you sure?(Y or N) ', eval: myEval, writer: myWriter});
	}
}

module.exports = {help, runner};