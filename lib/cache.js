/**
 * Cache the information of articles with the purpose to speed up the generation of archive and tag page
 */
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const convert = require('./convert');
const cwd = process.cwd();

/**
 * Generate cache data for all posts and saved as a json file
 * @return {[type]} [description]
 */
function generate () {
	var cache = {};
	var articlesdir = path.join(cwd, './source/article');
	var articles = fse.readdirSync(articlesdir);
	for (var i = 0; i < articles.length; i++) {
		var articleTitle = articles[i];
		var articlePath = path.join(articlesdir, articleTitle);
		var markdown = fse.readFileSync(articlePath, 'utf8');
		var frontMetaRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
		var result = frontMetaRegExp.exec(markdown);
		var frontMeta = yaml.safeLoad(result[1]);
		markdown = markdown.replace(frontMeta, '');
		var htmlContent = convert(frontMeta, markdown, 'article', articleTitle);
		var articleFilename = frontMeta.filename || articleTitle;
		cache[articleTitle] = {
			filename: articleFilename,
			tags: frontMeta.tags,
			category: frontMeta.category,
			createdDate: frontMeta.createdDate,
			content: htmlContent
		};
	}
	fse.writeFileSync(path.join(cwd, './cache.json'), JSON.stringify(cache));
}

/**
 * if cache.json does not exist, generate it
 * @return {[type]} [description]
 */
function guaranteeCacheExist () {
	if (!fse.existsSync(path.join(cwd, './cache.json'))) {
		generate();
	}
}

/**
 * get json data of cache
 * @return {[JSON]} [json data of cache]
 */
function getCacheJson () {
	guaranteeCacheExist();
	var cachePath = path.join(cwd, './cache.json');
	var cacheString = fse.readFileSync(cachePath, 'utf8');
	var cacheJson = JSON.parse(cacheString);
	return cacheJson;
}

/**
 * Add or update cache data
 * @param {[String]} title     [title of post]
 * @param {[Object]} data [post data]
 */
function addOrUpdate (title, data) {
	guaranteeCacheExist();
	var cachePath = path.join(cwd, './cache.json');
	var cacheJson = getCacheJson();
	cacheJson[title] = data;
	fse.writeFileSync(cachePath, JSON.stringify(cacheJson));
}

/**
 * Remove specific cache data of post
 * @param  {[String]} title [title of post]
 * @return {[type]}       [description]
 */
function remove (title) {
	guaranteeCacheExist();
	var cachePath = path.join(cwd, './cache.json');
	var cacheJson = getCacheJson();
	if (cacheJson[title]) {
		delete cacheJson[title];
		fse.writeFileSync(cachePath, JSON.stringify(cacheJson));
	}
}

module.exports = {add: addOrUpdate, update: addOrUpdate, remove, getCacheJson};