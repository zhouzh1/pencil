/**
 * Build formal page from draft
 */
const fse = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const EOL = require('os').EOL;
const processargvs = require(path.join(__dirname, '../lib/processargvs'));
const checkroot = require(path.join(__dirname, '../lib/checkroot'));
const convert = require(path.join(__dirname, '../lib/convert'));
const logger = require(path.join(__dirname, '../lib/logger'));
const index = require(path.join(__dirname, '../lib/index'));
const cache = require(path.join(__dirname, '../lib/cache'));
const archive = require(path.join(__dirname, '../lib/archive'));
const tag = require(path.join(__dirname, '../lib/tag'));
const category = require(path.join(__dirname, '../lib/category'));
const rss = require(path.join(__dirname, '../lib/rss'));
const cwd = process.cwd();

/**
 * Get help info about build command
 * @return {[type]} [description]
 */
function help () {
	console.log(`Usage: pencil build [type] <title>${EOL}`);
	console.log('  Description:');
	console.log('    make draft file move out from drafts folder and convert markdown to html');
	console.log('  Arguments:');
	console.log('    [type]  type of new entry, \'article\' or \'page\', default is \'article\'');
	console.log('    <title> title of draft, it is also the filename of draft');
}

/**
 * Build formal page from draft
 * @param  {[Array]} argvs [including type and title of draft]
 * @return {[type]}         [description]
 */
function runner (argvs) {
	if (!checkroot.isRootDir()) {
		return 1;
	}
	else {
		var {type, title} = processargvs(argvs, help);
		var draft = path.join(cwd, `./source/draft/${type}/${title}.md`);
		if (!fse.existsSync(draft)) {
			logger.error(`there is no ${type} draft whose title is ${title}`);
		}
		else {
			var markdown = fse.readFileSync(draft, 'utf8');
			var frontMetaRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
			var result = frontMetaRegExp.exec(markdown);
			var frontMeta = yaml.safeLoad(result[1]);
			var filename = frontMeta.filename || title;
			var filepath = path.join(cwd, `./public/${type}/${filename}.html`);
			if (fse.existsSync(filepath)) {
				logger.error(`there is already a html file whose filname is ${filename}`);
			}
			else {
				markdown = markdown.replace(result[0], '');
				var html = convert(frontMeta, markdown, type, title);
				if (html !== false) {
					fse.writeFileSync(filepath, html);
					var formal = path.join(cwd, `./source/${type}/${title}.md`);
					fse.move(draft, formal, (err) => {
						if (err) {
							logger.error(err.toString());
							return 1;
						}
					});
					// add new cache data
					cache.add(title, {filename, tags: frontMeta.tags, category: frontMeta.category, content: html});
					// generate new archive page
					archive.generate();
					// generate new tag pages
					tag.generate();
					// generate new category pages
					category.generate();
					// generate new index pages
					index.generate();
					//generate feed
					rss.generate();
				}
			}
		}
	}
}

module.exports = {help, runner};
