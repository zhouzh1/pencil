/**
 * utilities
 */

const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');
const fse = require('fs-extra');
const JSDOM = require('jsdom').JSDOM;
const logger = require('./logger');

const frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;
const config = yaml.safeLoad(fse.readFileSync('./config.yml', 'utf8'));

// extract abstract of a article
const extractAbstract = function(html) {
	let document = (new JSDOM(html)).window.document;
	let div = document.createElement('div');
	let children = document.body.children;
	// extract the first three child elements as abstract
	let slice = Array.prototype.slice.apply(children, [0, 3]);
	for (let i = 0; i < slice.length; i++) {
		div.appendChild(slice[i]);
	}
	return div.innerHTML;
};

// extract all articles from markdown source files
const articles = (function() {
	let articles = [];
	const articlesDir = './source/article';
	const files = fse.readdirSync(articlesDir);
	for (let file of files) {
		let source = fse.readFileSync(path.join(articlesDir, `./${file}`), 'utf8');
		// extract frontmatter information of article
		let result = frontmatterRegExp.exec(source);
		let frontmatter = yaml.safeLoad(result[1]);
		let filename = frontmatter.filename || frontmatter.title;
		// extract real article content
		let markdown = source.replace(result[0], '');
		let html = marked(markdown);
		articles.push({
			title: frontmatter.title,
			tags: frontmatter.tags,
			category: frontmatter.category,
			createdTime: frontmatter.createdTime,
			// replace spaces between words with '_'
			filename: filename.split(' ').join('_'),
			content: html,
			abstract: extractAbstract(html)
		});
	}
	// sort articles according to createdTime by descending order
	articles.sort(function(prev, next) {
		return (new Date(next.createdTime)).getTime() - (new Date(prev.createdTime)).getTime();
	});
	// add previous and next for every article
	let length = articles.length;
	for (let i = 0; i < length; i++) {
		let article = articles[i];
		let previous = articles[i - 1];
		let next = articles[i + 1];
		if (previous) {
			article.previous = {
				title: previous.title,
				filename: next.filename
			};
		}
		else {
			article.previous = null;
		}
		if (next) {
			article.next = {
				title: next.title,
				filename: next.filename
			};
		}
		else {
			article.next = null;
		}
	}
	return articles;
})();

module.exports = {
	getArticles: function() {
		return articles;
	},
	// extract all configuration information
	getConfig: function() {
		return config;
	},
	// extract all independent pages from markdown source files
	getPages: function() {
		let pages = [];
		const pagesDir = './source/page';
		const files = fse.readdirSync(pagesDir);
		for (let file of files) {
			let source = fse.readFileSync(path.join(pagesDir, `./${file}`), 'utf8');
			let result = frontmatterRegExp.exec(source);
			let frontmatter = yaml.safeLoad(result[1]);
			let filename = frontmatter.filename || frontmatter.title;
			// extract real page content
			let markdown = source.replace(result[0], '');
			let html = marked(markdown);
			pages.push({
				title: frontmatter.title,
				createdTime: frontmatter.createdTime,
				// replace spaces between words with '_'
				filename: filename.split(' ').join('_'),
				content: html
			});
		}
		return pages;
	},
	// extract all tags and its related articles
	getTags: function() {
		let exists = [];
		let map = {};
		for (let article of articles) {
			let tags = article.tags;
			for (let tag of tags) {
				if (!exists.includes(tag)) {
					exists.push(tag);
					map[tag] = [];
				}
				map[tag].push(article);
			}
		}
		return map;
	},
	// extract all categories and its related articles
	getCategories: function() {
		let exists = [];
		let map = {};
		for (let article of articles) {
			let category = article.category;
			if (!exists.includes(category)) {
				exists.push(category);
				map[category] = [];
			}
			map[category].push(article);
		}
		return map;
	},
	// extract archives of all articles
	getArchives: function() {
		let exists = [];
		let map = {};
		for (let article of articles) {
			let year = (new Date(article.createdTime)).getFullYear();
			if (!exists.includes(year)) {
				exists.push(year);
				map[year] = [];
			}
			map[year].push(article);
		}
		return map;
	},
	// check current theme whether is complete
	// a complete theme must has 'index.ejs', 'artcile.ejs' and corresponding template for independent pages
	checkTheme: function() {
		let theme = `./public/theme/${config.site.theme}`;
		let articleTemplate = path.join(theme, './article.ejs');
		let indexTemplate = path.join(theme, './index.ejs');
		let essentials = [];
		essentials.push(articleTemplate, indexTemplate);
		let files = fse.readdirSync('./source/page');
		for (let file of files) {
			let filename = path.parse(file).name;
			essentials.push(path.join(theme, `./${filename}.ejs`));
		}
		let lacks = essentials.filter(function(template) {
			return !fse.existsSync(template);
		});
		if (lacks.length > 0) {
			logger.error(`not a complete theme: ${config.site.theme}`);
			console.log('the following templates are absent:');
			for (let template of lacks) {
				console.log(path.parse(template).base);
			}
			process.exit();
		}
	},
	// clear older static pages
	clear: function() {
		// retain 'assets' and 'theme'
		let retentions = ['theme'];
		let items = fse.readdirSync('./public');
		items.forEach(function(item){
			if (!retentions.includes(item)) {
				fse.removeSync(`./public/${item}`);
			}
		});
	}
};

