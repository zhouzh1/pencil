/**
 * generate command
 */

const checkroot = require('../lib/checkroot');
checkroot.check();

const RSS = require('rss');
const ejs = require('ejs');
const fse = require('fs-extra');
const EOL = require('os').EOL;
const utils = require('../lib/utils');
const logger = require('../lib/logger');
const transform = require('../lib/transform');

// assemble common data for all pages
const config = utils.getConfig();
const articles = utils.getArticles();
const tags = utils.getTags();
const categories = utils.getCategories();
const archives = utils.getArchives();
let common = {
	config: config,
	data: {
		tags: tags,
		archives: archives,
		categories: categories,
	}
};

// cache variables
const site = config.site;
const pageSize = site.pageSize;
const theme = site.theme;
const host = site.host;

function help() {
	console.log(`Usage: pencil generate${EOL}`);
	console.log('  Description:');
	console.log('    generate all static pages');
}

function generateArticles() {
	logger.info('generating articles...');
	for (let article of articles) {
		transform(article, common, 'article');
	}
}

function generatePages() {
	logger.info('generating pages...');
	const pages = utils.getPages();
	for (let page of pages) {
		transform(page, common, 'page');
	}
}

function generateTags() {
	const template = `./public/theme/${theme}/tag.ejs`;
	if (!fse.existsSync(template)) {
		return false;
	}
	logger.info('generating tag pages...');
	const templateString = fse.readFileSync(template, 'utf8');
	let locals = {
		config: config,
		data: common.data
	};
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
					fse.outputFileSync(`./public/tag/${tag}/page-${i + 1}/index.html`, html);
				}
				catch (error) {
					logger.error(error.toString());
					process.exit();
				}
			}
			// make http://<domain>/tag/<tag> accessible
			let from = `./public/tag/${tag}/page-1/index.html`;
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

function generateCategories() {
	const template = `./public/theme/${theme}/category.ejs`;
	if (!fse.existsSync(template)) {
		return false;
	}
	logger.info('generating category pages...');
	const templateString = fse.readFileSync(template, 'utf8');
	let locals = {
		config: config,
		data: common.data
	};
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
					fse.outputFileSync(`./public/tag/${category}/page-${i + 1}/index.html`, html);
				}
				catch (error) {
					logger.error(error.toString());
					process.exit();
				}
			}
			// make http://<domain>/category/<tag> accessible
			let from = `./public/tag/${category}/page-1/index.html`;
			let to = `./public/tag/${category}/index.html`;
			fse.copySync(from, to);
		}
		else {
			locals.data.articles = articles;
			try {
				let html = ejs.render(templateString, locals, { filename: template });
				fse.outputFileSync(`./public/tag/${category}/index.html`, html);
			}
			catch (error) {
				logger.error(error.toString());
				process.exit();
			}
		}
	}
}

function generateArchives() {
	const template = `./public/theme/${theme}/archive.ejs`;
	if (!fse.existsSync(template)) {
		return false;
	}
	logger.info('generating archive page...');
	const templateString = fse.readFileSync(template, 'utf8');
	let locals = {
		config: config,
		data: common.data
	};
	try {
		let html = ejs.render(templateString, locals, { filename: template });
		fse.outputFileSync('./public/archive/index.html', html);
	}
	catch (error) {
		logger.error(error.toString());
		process.exit();
	}
}

function generateIndex() {
	logger.info('generating index pages...');
	const template = `./public/theme/${theme}/index.ejs`;
	const templateString = fse.readFileSync(template, 'utf8');
	let locals = {
		config: config,
		data: common.data
	};
	// if pageSize > 0, display by paging
	if (pageSize > 0) {
		let pageCounts = Math.ceil(articles.length / pageSize);
		locals.data.pageCounts = pageCounts;
		for (let i = 0; i < pageCounts; i++) {
			locals.data.articles = articles.slice(i * pageSize, (i + 1) * pageSize);
			locals.data.currentPage = i + 1;
			try {
				let html = ejs.render(templateString, locals, { filename: template });
				fse.outputFileSync(`./public/page-${i + 1}/index.html`, html);
			}
			catch (error) {
				logger.error(error.toString());
				process.exit();
			}
		}
		// make http://<domain>/index.html accessible
		let from = './public/page-1/index.html';
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
	logger.info('generating rss feed...');
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
		let filename = article.filename.split(' ').join('_');
		feed.item({
			title: article.title,
			description: article.content,
			url: `${public}/${filename}.html`,
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
		// check theme
		utils.checkTheme();
		// clear
		utils.clear();
		// generate pages
		generateArticles();
		generatePages();
		generateIndex();
		generateTags();
		generateArchives();
		generateCategories();
		generateRss();
		console.log(`${EOL}End!`);
	}
}

module.exports = { help, runner };