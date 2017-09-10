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
// if theme in use has config.yml, then save it as config.themeConfig
const themeConfig = `./themes/${config.site.theme}/config.yml`;
if (fse.existsSync(themeConfig)) {
	config.themeConfig = yaml.safeLoad(fse.readFileSync(themeConfig, 'utf8'));
}

// options for marked
const options = {
	breaks: true
};

// extract abstract of a article
const extractAbstract = function(html) {
	let document = (new JSDOM(html)).window.document;
	let div = document.createElement('div');
	let children = document.body.children;
	// extract the first five child elements as abstract
	let slice = Array.prototype.slice.apply(children, [0, 5]);
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
		let html = marked(markdown, options);
		articles.push({
			title: frontmatter.title,
			tags: frontmatter.tags,
			category: frontmatter.category,
			createdTime: frontmatter.createdTime,
			// replace spaces between words with '_'
			filename: `${filename.split(' ').join('_')}.html`,
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
				filename: previous.filename
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

// extract all pages from markdown source files
const pages = (function() {
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
		let html = marked(markdown, options);
		pages.push({
			title: frontmatter.title,
			createdTime: frontmatter.createdTime,
			// replace spaces between words with '_'
			filename: `${filename.split(' ').join('_')}.html`,
			content: html
		});
	}
	return pages;
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
		return pages;
	},
	// extract link information from pages
	getPageLinks: function() {
		let map = {};
		for (let page of pages) {
			map[page.title] = `/page/${page.filename}`;
		}
		return map;
	},
	// extract all tags and its related articles
	getTags: function() {
		let map = {};
		for (let article of articles) {
			let tags = article.tags;
			if (tags.length) {
				for (let tag of tags) {
					if (!map[tag]) {
						map[tag] = [];
					}
					map[tag].push(article);
				}
			}
		}
		return map;
	},
	// extract all categories and its related articles
	getCategories: function() {
		let map = {};
		for (let article of articles) {
			let category = article.category;
			if (category) {
				if (!map[category]) {
					map[category] = [];	
				}
				map[category].push(article);
			}
		}
		return map;
	},
	// extract archives of all articles
	getArchives: function() {
		let map = {};
		for (let article of articles) {
			let date = new Date(article.createdTime);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			// convert 1, 2, 3,...,9 to '01', '02', '03',..., '09'
			if (month < 10) {
				month = '0' + month;
			}
			if (!map[year]) {
				map[year] = {};
			}
			if (!map[year][month]) {
				map[year][month] = [];
			}
			map[year][month].push(article);
		}
		return map;
	},
	// check current theme whether is complete
	// a valid theme must has 'views', 'views/index.ejs', 'views/artcile.ejs' and 'views/page.ejs', 'theme_assets'
	checkTheme: function() {
		let theme = `./themes/${config.site.theme}`;
		let essentials = ['views', 'views/article.ejs', 'views/page.ejs', 'views/index.ejs', 'theme_assets'];
		let lacks = essentials.filter(function(item) {
			return !fse.existsSync(path.join(theme, `./${item}`));
		});
		if (lacks.length > 0) {
			logger.error(`not a valid theme: ${config.site.theme}`);
			console.log('the following directories and files are absent:');
			for (let item of lacks) {
				console.log(item);
			}
			process.exit();
		}
	},
	// clear older static pages
	clear: function() {
		// the following items will be reserved
		let retention = ['site_assets'];
		let items = fse.readdirSync('./public');
		items.forEach(function(item){
			if (!retention.includes(item)) {
				fse.removeSync(`./public/${item}`);
			}
		});
	}
};


