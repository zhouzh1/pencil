/**
 * Convert markdown to html
 */
const fse = require('fs-extra');
const path = require('path');
const marked = require('marked');
const ejs = require('ejs');
const yaml = require('js-yaml');
const logger = require('./logger');
const cwd = process.cwd();

/**
 * Convert markdown to html
 * @param  {Object} frontMeta include tags information of articles
 * @param  {String} markdown  The raw markdown content of article
 * @param  {String} type      article or page
 * @param  {String} title     title of article or page
 * @return {String}           html content after converted
 */
module.exports = function (frontMeta, markdown, type, title) {
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var theme = config.site.theme;
	var themedir = path.join(cwd, `./public/theme/${theme}`);
	switch (type) {
		case 'article':
			var template = path.join(themedir, './article.ejs');
			break;
		case 'page':
			var template = path.join(themedir, `./${title}.ejs`);
			break;
		default:
			break;
	}
	if (!fse.existsSync(template)) {
		logger.error(`could not find the corresponding template, please ensure theme '${theme}' is completed`);
		return false;
	}
	var pageData = {
		pageTitle: title,
		data: frontMeta
	}
	pageData.data.body = marked(markdown);
	var locals = Object.assign({ page: pageData }, config);
	try {
		var html = ejs.render(fse.readFileSync(template), locals, { filename: template });
		return html;
	}
	catch (error) {
		logger.error(`[${template}] ${err.toString()}`);
		return false;
	}
};
