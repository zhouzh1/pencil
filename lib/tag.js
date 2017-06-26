/**
 * Generate the tag page
 */

const fse = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const logger = require('./logger');
const cache = require('./cache');
const cwd = process.cwd();

/**
 * Generate tag page
 * @return {[type]} [description]
 */
function generate () {
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var pageSize = config.site.pageSize;
	var theme = config.site.theme;
	var themeDir = path.join(cwd, `./public/theme/${theme}`);
	var template = path.join(themeDir, './tag.ejs');
	if (!fse.existsSync(template)) {
		logger.warn('could not find the template file for tag page');
		return false;
	}
	else {
		logger.info('generating tag pages......');
		var tagsMap = {};
		var cacheJson = cache.getCacheJson();
		var allTags = Object.keys(tagsMap);
		for (var title in cacheJson) {
			var post = cacheJson[title];
			var filename = post.filename;
			var category = post.category;
			var createdDate = post.createdDate;
			var content = post.content;
			var tags = post.tags;
			var tagCounts = tags.length;
			for (var i = 0; i < tagCounts; i++) {
				var tag = tags[i];
				if (allTags.indexOf(tag) == -1) {
					allTags.push(tag);
					tagsMap[tag] = [];
				}
				tagsMap[tag].push({title, filename, createdDate, category, content});
			}
		}
		var tagsDir = path.join(cwd, './public/tag');
		var tempTagsDir = path.join(cwd, './public/temp_tag');
		var allTagsCounts = allTags.length;
		for (var i = 0; i < allTagsCounts; i++) {
			var tag = allTags[i];
			var tagDir = path.join(tempTagsDir, `./${tag}`);
			var postsWithTag = tagsMap[tag];
			postsWithTag.sort(function (prev, next) {
				var timeOfPrev = new Date(prev.createdDate).getTime();
				var timeOfNext = new Date(next.createdDate).getTime();
				return (timeOfNext - timeOfPrev);
			});
			var pageCounts = Math.ceil(postsWithTag.length / pageSize);
			for (var page = 0; page < pageCounts; page++) {
				var postsCurrentPage = postsWithTag.slice(page * pageSize, (page + 1) * pageSize);
				var pageData = {
					pageTitle: `Tag - ${tag}`,
					data: {
						currentTag: tag,
						postsCurrentPage: postsCurrentPage,
						pageCounts: pageCounts,
						currentPage: page + 1
					}
				};
				var locals = Object.assign({ page: pageData }, config);
				try {
					var html = fse.readFileSync(fse.readFileSync(template), locals, { filename: template });
					var currentPagePath = path.join(tagDir, `./page-${page + 1}/index.html`);
					fse.writeFileSync(currentPagePath, html);
				}
				catch (error) {
					logger.error(`[${template}] ${err.toString()}`);
					fse.removeSync(tempTagsDir);
					return false;
				}
			}
			fse.copySync(path.join(tagDir, './page-1/index.html'), path.join(tagDir, './index.html'));
		}
		// remove old tag pages
		fse.removeSync(tagsDir);
		fse.renameSync(tempTagsDir, tagsDir);
		logger.info('The tag page is generated successfully!');
	}
}

module.exports = {generate};