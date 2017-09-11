/**
 * generate command
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const RSS = require('rss');
const ejs = require('ejs');
const path = require('path');
const fse = require('fs-extra');
const utils = require('../lib/utils');
const logger = require('../lib/logger');

// cache setting
const LRU = require('lru-cache');
ejs.cache = LRU(500);

// extract all essential data
const config = utils.getConfig();
const articles = utils.getArticles();
const pages = utils.getPages();
const tags = utils.getTags();
const categories = utils.getCategories();
const archives = utils.getArchives();
const pageLinks = utils.getPageLinks();
// assemble data
let data = { tags, archives, categories, pageLinks };
// invoke plugins
let plugins = {};
const pluginsdir = './plugins';
if (fse.existsSync(pluginsdir)) {
	const cwd = process.cwd();
	const files = fse.readdirSync(pluginsdir);
	for (let file of files) {
		let pluginName = path.parse(file).name;
		// every plugin is a function and called with 7 arguments
		try {
			let func = require(path.join(cwd, `./plugins/${pluginName}`));
			if (typeof func === 'function') {
				let result = func(config, articles, pages, tags, categories, archives, pageLinks);
				// insert result of plugin function
				plugins[pluginName] = result;
			}
			else {
				logger.error(`Plugin Error: ${pluginName} - ${func} is not a function`);
				process.exit();
			}
		}
		catch (error) {
			logger.error(`Plugin Error: ${pluginName} - ${error.toString()}`);
			process.exit();
		}
	}
}

// add copy function to object
Object.defineProperty(Object.prototype, 'copy', {
	configurable: false,
	enumerable: false,
	writable: false,
	value: 	function() {
		let duplicate = {};
		for (let key in this) {
			if (this.hasOwnProperty(key)) {
				duplicate[key] = this[key]
			}
		}
		return duplicate;
	}
});

// cache variables
const site = config.site;
const pageSize = site.pageSize;
const theme = site.theme;
const host = site.host;

function help() {
	console.log('Usage: pencil generate');
	console.log('  Description:');
	console.log('    generate all static pages');
}

/**
 * transform article.ejs or page.ejs to html file
 * @param  {[type]} item           article or page data
 * @param  {[type]} template       path of template
 * @param  {[type]} templateString template string
 * @param  {[type]} type           'article' or 'page'
 */
function transform(item, template, templateString, type) {
	let locals = { config, plugins, data: data.copy() };
	locals.data[type] = item;
	// add label of page
	locals.data.label = item.title;
	try {
		let html = ejs.render(templateString, locals, { filename: template });
		fse.outputFileSync(`./public/${type}/${item.filename}`, html);
	}
	catch (error) {
		logger.error(error.toString());
		process.exit();
	}
}

function generateArticles() {
	if (articles.length > 0) {
		console.log('[+] generating articles...');
		const template = `./themes/${theme}/views/article.ejs`;
		const templateString = fse.readFileSync(template, 'utf8');
		for (let article of articles) {
			transform(article, template, templateString, 'article');
		}
	}
}

function generatePages() {
	if (pages.length > 0) {
		console.log('[+] generating pages...');
		const template = `./themes/${theme}/views/page.ejs`;
		const templateString = fse.readFileSync(template, 'utf8');
		for (let page of pages) {
			transform(page, template, templateString, 'page');
		}
	}
}

function generateTags() {
	// if there are some tags, then generate index pages of tags
	if (Object.keys(tags).length > 0) {
		console.log('[+] generating tag pages...');
		const template = `./themes/${theme}/views/index.ejs`;
		const templateString = fse.readFileSync(template, 'utf8');
		let locals = { config, plugins, data: data.copy() };
		locals.data.label = 'tag';
		// if theme in use contains 'tag.ejs', then generate summary page of tags
		let tagTemplate = `./themes/${theme}/views/tag.ejs`;
		if (fse.existsSync(tagTemplate)) {
			let tagTemplateString = fse.readFileSync(tagTemplate, 'utf8');
			try {
				let html = ejs.render(tagTemplateString, locals, { filename: tagTemplate });
				fse.outputFileSync('./public/tag/index.html', html);
			}
			catch (error) {
				logger.error(error.toString());
				process.exit();
			}
		}
		// generate index pages of tags
		for (let tag in tags) {
			locals.data.currentTag = tag;
			let articles = tags[tag];
			// if pageSize > 0, displaying by paging
			if (pageSize > 0) {
				let pageCounts = Math.ceil(articles.length / pageSize);
				locals.data.pageCounts = pageCounts;
				for (let i = 0; i < pageCounts; i++) {
					locals.data.articles = articles.slice(i * pageSize, (i + 1) * pageSize);
					locals.data.currentPage = i + 1;
					try {
						let html = ejs.render(templateString, locals, { filename: template });
						fse.outputFileSync(`./public/tag/${tag}/page/${i + 1}/index.html`, html);
					}
					catch (error) {
						logger.error(error.toString());
						process.exit();
					}
				}
				// make http://<domain>/tag/<tag> accessible
				let from = `./public/tag/${tag}/page/1/index.html`;
				let to = `./public/tag/${tag}/index.html`;
				fse.copySync(from, to);
			}
			else {
				locals.data.articles = articles;
				try {
					let html = ejs.render(templateString, locals, { filename: template });
					fse.outputFileSync(`./public/tag/${tag}/index.html`, html);
				}
				catch (error) {
					logger.error(error.toString());
					process.exit();
				}
			}
		}
	}
}

function generateCategories() {
	// if there are some categories, then generate index pages of categories
	if (Object.keys(categories).length > 0) {
		console.log('[+] generating category pages...');
		const template = `./themes/${theme}/views/index.ejs`;
		const templateString = fse.readFileSync(template, 'utf8');
		let locals = { config, plugins, data: data.copy() };
		locals.data.label = 'category';
		// if theme in use contains 'category.ejs', then generate summary page of categories
		let categoryTemplate = `./themes/${theme}/views/category.ejs`;
		if (fse.existsSync(categoryTemplate)) {
			let categoryTemplateString = fse.readFileSync(categoryTemplate, 'utf8');
			try {
				let html = ejs.render(categoryTemplateString, locals, { filename: categoryTemplate });
				fse.outputFileSync('./public/category/index.html', html);
			}
			catch (error) {
				logger.error(error.toString());
				process.exit();
			}
		}
		// generate index pages of categories
		for (let category in categories) {
			locals.data.currentCategory = category;
			let articles = categories[category];
			// if pageSize > 0, displaying by paging
			if (pageSize > 0) {
				let pageCounts = Math.ceil(articles.length / pageSize);
				locals.data.pageCounts = pageCounts;
				for (let i = 0; i < pageCounts; i++) {
					locals.data.articles = articles.slice(i * pageSize, (i + 1) * pageSize);
					locals.data.currentPage = i + 1;
					try {
						let html = ejs.render(templateString, locals, { filename: template });
						fse.outputFileSync(`./public/category/${category}/page/${i + 1}/index.html`, html);
					}
					catch (error) {
						logger.error(error.toString());
						process.exit();
					}
				}
				// make http://<domain>/category/<tag> accessible
				let from = `./public/category/${category}/page/1/index.html`;
				let to = `./public/category/${category}/index.html`;
				fse.copySync(from, to);
			}
			else {
				locals.data.articles = articles;
				try {
					let html = ejs.render(templateString, locals, { filename: template });
					fse.outputFileSync(`./public/category/${category}/index.html`, html);
				}
				catch (error) {
					logger.error(error.toString());
					process.exit();
				}
			}
		}
	}
}

function generateArchives() {
	// if theme in use contains 'archive.ejs', then generate archive page
	const template = `./themes/${theme}/views/archive.ejs`;
	if (fse.existsSync(template)) {
		console.log('[+] generating archive page...');
		const templateString = fse.readFileSync(template, 'utf8');
		let locals = { config, plugins, data: data.copy() };
		locals.data.label = 'archive';
		try {
			let html = ejs.render(templateString, locals, { filename: template });
			fse.outputFileSync('./public/archive/index.html', html);
		}
		catch (error) {
			logger.error(error.toString());
			process.exit();
		}
	}
}

function generateIndex() {
	console.log('[+] generating index pages...');
	const template = `./themes/${theme}/views/index.ejs`;
	const templateString = fse.readFileSync(template, 'utf8');
	let locals = { config, plugins, data: data.copy() };
	locals.data.label = 'index';
	// if exist some articles and pageSize > 0, display by paging
	if (articles.length > 0 && pageSize > 0) {
		let pageCounts = Math.ceil(articles.length / pageSize);
		locals.data.pageCounts = pageCounts;
		for (let i = 0; i < pageCounts; i++) {
			locals.data.articles = articles.slice(i * pageSize, (i + 1) * pageSize);
			locals.data.currentPage = i + 1;
			try {
				let html = ejs.render(templateString, locals, { filename: template });
				fse.outputFileSync(`./public/page/${i + 1}/index.html`, html);
			}
			catch (error) {
				logger.error(error.toString());
				process.exit();
			}
		}
		// make http://<domain>/index.html accessible
		let from = './public/page/1/index.html';
		let to = './public/index.html';
		fse.copySync(from, to);
	}
	else {
		locals.data.articles = articles;
		try {
			let html = ejs.render(templateString, locals, { filename: template });
			fse.outputFileSync('./public/index.html', html);
		}
		catch (error) {
			logger.error(error.toString());
			process.exit();
		}
	}
}

function generateRss() {
	console.log('[+] generating rss feed...');
	let feed = new RSS({
		title: site.title,
		description: site.description,
		feed_url: `${host}/rss.xml`,
		site_url: host,
		webMaster: site.author,
		copyright: site.copyright,
		pubDate: new Date().toUTCString()
	});
	let public = `${host}/article`;
	let rssSize = site.rssSize;
	if (!(rssSize >0 && rssSize <= articles.length)) {
		rssSize = articles.length;
	}
	for (let i = 0; i < rssSize; i++) {
		let article = articles[i];
		feed.item({
			title: article.title,
			description: article.content,
			url: `${public}/${article.filename}.html`,
			date: new Date(article.createdTime).toUTCString()
		});
	}
	var xml = feed.xml();
	fse.outputFileSync('./public/rss.xml', xml);
}

function runner(argvs) {
	if (argvs.length > 0) {
		help();
		process.exit();
	}
	else {
		const startTime = new Date().getTime();
		// check theme
		utils.checkTheme();
		// clear
		utils.clear();
		// copy theme assets
		fse.copySync(`./themes/${theme}/theme_assets`, './public/theme_assets');
		// generate pages
		generateArticles();
		generatePages();
		generateIndex();
		generateTags();
		generateCategories();
		generateArchives();
		generateRss();
		const endTime = new Date().getTime();
		console.log(`[+] generate successfully! All cost ${(endTime - startTime) / 1000}s`);
	}
}

module.exports = { help, runner };