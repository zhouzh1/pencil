/**
 * Genarate the category page
 */

const fse = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const logger = require('./logger');
const cache = require('./cache');
const cwd = process.cwd();

/**
 * Generate category page
 * @return {[type]} [description]
 */
function generate () {
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var pageSize = config.site.pageSize;
	var theme = config.site.theme;
	var themeDir = path.join(cwd, `./public/theme/${theme}`);
	var template = path.join(themeDir, './category.ejs');
	if (!fse.existsSync(template)) {
		logger.warn('could not find the template file for category page');
		return false;
	}
	else {
		logger.info('generating category page......');
		var categoryMap = {};
		var cacheJson = cache.getCacheJson();
		var categories = Object.keys(categoryMap);
		for (var title in cacheJson) {
			var post = cacheJson[title];
			var filename = post.filename;
			var tags = post.tags;
			var createdDate = post.createdDate;
			var category = post.category;
			var content = post.content;
			if (categories.indexOf(category) == -1) {
				categories.push(category);
				categoryMap[category] = [];
			}
			categoryMap[category].push({title, filename, tags, createdDate, content});
		}
		var categoriesDir = path.join(cwd, './public/category');
		var tempCategoriesDir = path.join(cwd, './public/temp_category');
		var categoryCounts = categories.length;
		for (var i = 0; i < categoryCounts; i++) {
			var category = categories[i];
			var categoryDir = path.join(tempCategoriesDir, `./${category}`);
			var postsWithCategory = categoryMap[category];
			postsWithCategory.sort(function (prev, next) {
				var timeOfPrev = new Date(prev.createdDate).getTime();
				var timeOfNext = new Date(next.createdDate).getTime();
				return (timeOfNext - timeOfPrev);
			});
			var pageCounts = Math.ceil(postsWithCategory.length / pageSize);
			for (var page = 0; page < pageCounts; page++) {
				var postsCurentPage = postsWithCategory.slice(page * pageSize, (page + 1) * pageSize);
				var pageData = {
					pageTitle: `Category - ${category}`,
					data: {
						currentCategory: category,
						postsCurentPage: postsCurentPage,
						pageCounts: pageCounts,
						currentPage: page + 1
					}
				};
				var locals = Object.assign({ page: pageData }, config);
				try {
					var html = ejs.render(fse.readFileSync(template), locals, { filename: template });
					var currentPagePath = path.join(categoryDir, `./page-${page + 1}/index.html`);
					fse.writeFileSync(currentPagePath, html);
				}
				catch (error) {
					logger.error(`[${template}] ${err.toString()}`);
					fse.removeSync(tempCategoriesDir);
					return false;
				}
			}
			fse.copySync(path.join(categoryDir, './page-1/index.html'), path.join(categoryDir, './index.html'));
		}
		// remove old category pages
		fse.removeSync(categoriesDir);
		fse.renameSync(tempCategoriesDir, categoriesDir);
		logger.info('the category page is generated successfully!');
	}
}

module.exports = { generate };