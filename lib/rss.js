/**
 * generate rss feed
 */

const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const RSS = require('rss');
const cache = require('./cache');
const logger = require('./logger');
const cwd = process.cwd();

function generate () {
	logger.info('generating RSS feed......');
	var configFile = path.join(cwd, './config.yml');
	var config = yaml.safeLoad(fse.readFileSync(configFile, 'utf8'));
	var feed = new RSS({
		title: config.site.title,
		description: config.site.description,
		feed_url: `${config.site.host}/rss.xml`,
		site_url: config.site.host,
		webMaster: config.site.author,
		copyright: config.site.copyright,
		pubDate: new Date().toUTCString()
	});
	var cacheJson = cache.getCacheJson();
	var posts = [];
	for (var title in cacheJson) {
		var post = cacheJson[title];
		post.title = title;
		posts.push[post];
	}
	posts.sort(function (prev, next) {
		var timeOfPrev = new Date(prev.createdDate).getTime();
		var timeOfNext = new Date(next.createdDate).getTime();
		return (timeOfNext - timeOfPrev);
	});
	process.exit(0);
	var public = `${config.site.host}/article`;
	var rssSize = config.site.rssSize;
	for (var i = 0; i < rssSize; i++) {
		var post = posts[i];
		feed.item({
			title: post.title,
			url: `${public}/${post.filename}.html`,
			date: new Date(post.createdDate).toUTCString()
		});
	}
	var xml = feed.xml();
	var feedPath = path.join(cwd, './public/rss.xml');
	fse.writeFileSync(feedPath, xml);
	logger.info('generate RSS feed successfully');
}

module.exports = { generate };
