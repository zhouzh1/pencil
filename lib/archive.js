/**
 * Generate the archive page
 */

const fse = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const logger = require('./logger');
const cache = require('./cache');
const cwd = process.cwd();

/**
 * Generate archive page
 * @return {[type]} [description]
 */
function generate () {
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var theme = config.site.theme;
	var themeDir = path.join(cwd, `./public/theme/${theme}`);
	var template = path.join(themeDir, './archive.ejs');
	if (!fse.existsSync(template)) {
		logger.warn('could not find the template file for archive page');
		return false;
	}
	else {
		logger.info('generating archive page......');
		var archive = {};
		var cacheJson = cache.getCacheJson();
		var years = Object.keys(archive);
		for (var title in cacheJson) {
			var post = cacheJson[title];
			var filename = post.filename;
			var createdDate = post.createdDate;
			var year = new Date(createdDate).getFullYear();
			var tags = post.tags;
			var category = post.category;
			var content = post.content;
			if (years.indexOf(year) == -1) {
				years.push(year);
				archive[year] = [];
			}
			archive[year].push({title, filename, tags, category, createdDate, content});
		}
		var pageData = {
			pageTitle: `${config.site.title} - Archive`,
			data: archive
		}
		var locals = Object.assign({ page: pageData }, config);
		try {
			var html = ejs.render(fse.readFileSync(template), locals, { filename: template });
			var filepath = path.join(cwd, './public/archive/index.html');
			fse.writeFileSync(filepath, html);
			logger.info('the archive page is generated successfully!');
		}
		catch (error) {
			logger.error(`[${template}] ${err.toString()}`);
			return false;
		}
	}
}

module.exports = {generate};