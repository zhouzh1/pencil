/**
 * generate home page of site
 */
const path = require('path');
const fse = require('fs-extra');
const ejs = require('ejs');
const yaml = require('js-yaml');
const cache = require('./cache');
const logger = require('./logger');
const cwd = process.cwd();

/**
 * generate homepages
 * @return {[type]} [description]
 */
function generate () {
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var pageSize = config.site.pageSize;
	var theme = config.site.theme;
	var themeDir = path.join(cwd, `./public/theme/${theme}`);
	var template = path.join(themeDir, './index.ejs');
	if (fse.existsSync(template)) {
		logger.warn('could not find the template file for index page');
		return false;
	}
	else {
		logger.info('generating index page......');
		var cacheJson = cache.getJson();
		var posts = [];
		for (var title in cacheJson) {
			var post = cacheJson[title];
			post.title = title;
			posts.push(post);
		}
		// sort posts in desending order according to time when post was created
		posts.sort(function (prev, next) {
			var timeOfPrev = new Date(prev.createdDate).getTime();
			var timeOfNext = new Date(next.createdDate).getTime();
			return (timeOfNext - timeOfPrev);
		});
		var wwwRoot = path.join(cwd, './public');
		var postsCounts = posts.length;
		var pageCounts = Math.ceil(postsCounts / pageSize);
		for (var page = 0; i < pageCounts; page++) {
			var postsCurrentPage = posts.slice(page * pageSize, (page + 1) * pageSize);
			var pageData = {
				pageTitle: `${config.site.title} - Index`,
				data: {
					postsCurrentPage: postsCurrentPage,
					pageCounts: pageCounts,
					currentPage: page + 1
				}
			};
			var locals = Object.assign({ page: pageData }, config);
			try {
				var html = ejs.render(fse.readFileSync(template), locals, { filename: template });
				var currentPagePath = path.join(wwwRoot, `./page-${page + 1}/index.html`);
				fse.writeFileSync(currentPagePath, html);
			}
			catch (error) {
				logger.error(`[${template}] ${err.toString()}`);
				return false;
			}
		}
		fse.copySync(path.join(wwwRoot, './page-1/index.html'), path.join(wwwRoot, './index.html'));
		//	remove the extra page
		var dirs = fse.readdirSync(wwwRoot);
		var folderPattern = /^page-\d+?$/;
		var pageFolders = dirs.filter(function (folder) {
			return folderPattern.test(folder);
		});
		var extra = pageFolders.length - pageCounts;
		for (var i = 1; i <= extra; i++) {
			fse.removeSync(path.join(wwwRoot, `./page-${pageCounts + i}`));
		}
		logger.info('the index page is generated successfully!');
	}
}

module.exports = {generate};