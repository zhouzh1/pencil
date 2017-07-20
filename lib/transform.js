/**
 * tranform ejs template for article and page to html
 */

const ejs = require('ejs');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const logger = require('./logger');

// cache template string of article
const config = yaml.safeLoad(fse.readFileSync('./config.yml', 'utf8'));
const theme = config.site.theme;
const articleTemplate = `./public/theme/${theme}/article.ejs`;
const articleTemplateString = fse.readFileSync(articleTemplate, 'utf8');

/**
 * transform function
 * @param  {[type]} item   article or page object
 * @param  {[type]} common common data for all articles and pages
 * @param  {[type]} type   'article' or 'page'
 * @return {[type]}        [description]
 */
module.exports = function (item, common, type) {
	switch (type) {
		case 'article':
			var template = articleTemplate;
			var templateString = articleTemplateString;
			break;
		case 'page':
			// replace spaces between words with '_'
			var template = `./public/theme/${theme}/${item.title.split(' ').join('_')}.ejs`;
			var templateString = fse.readFileSync(template, 'utf8');
			break;
		default:
			break;
	}
	// assemble locals data for rendering template
	let locals = {
		config: config,
		data: common.data
	};
	locals.data[type] = item;
	try {
		let html = ejs.render(templateString, locals, { filename: template });
		fse.outputFileSync(`./public/${type}/${item.filename.split(' ').join('_')}.html`, html);
	}
	catch (error) {
		logger.error(error.toString());
		process.exit();
	}
};
