# About

This is a Node.js static blog generator. By means of [GithubPages](https://pages.github.com/), you only need to edit articles in markdown and execute some commands in terminal, a online blog site would be prepared for you. See[Demo](https://zhouzh1.github.io).

# Prerequisites

1. Node 6.x and above
2. Git client

# Install

`npm install pencil-cli --global`.

# Usage

1. Create a github repository named `<yourname>.github.io` and clone
2. Change to `source` branch, `git checkout -b source`
3. Initiate a new site with `<yourname.github.io>`, `pencil init ./`
4. Config site in `config.yml`
4. Display help information, `pencil help`

# Directory structure

After initiation, following directory structure has been created.

```
.
|____site
  |____config.yml      # configuration file
  |____public          # root directory of site
    |____site_assets   # static assets of site
    |____theme_assets  # static assets of theme in use
  |____source          # markdown source file
  |____plugins         # plugins for site
  |____themes          # themes for blog
```

# Commands

- `pencil help [command]` Display help information
- `pencil init <dir>` Initiate a new site, `<dir>` must be a empty git repository
- `pencil create <type> <title>` Create a new draft,  `<type>` is either 'article' or 'page', the default markdown editor will be opened automatically
- `pencil publish <type> <title>` Publish draft, `<type>` and `<title>` is the same as in `create`
- `pencil generate` Generate site, site contents are saved under `./public`
- `pencil server [port]` Start a local server listening on `[port]` to preview, default `[port]` is 3000
- `pencil deploy` Deploy to remote server
- `pencil list [type]` List drafts, articles and pages
- `penicl edit <type> <title>` Modify article and page
- `pencil delete <type> <title>` Delete draft, article and page

# Deploy

The local repository must work under `source` branch, after `pencil deploy`, local `source` branch would be push to remote `source` branch and `./public` would be push to remote `master` branch.

# Create themes

The template engine in use is [ejs](https://github.com/tj/ejs), a valid theme must contain follwing directories and files:

1. `views`, store all view templates
2. `theme_assets`, store css, js, images and fonts, etc.
3. `views/index.ejs`, generate various index pages
4. `views/article.ejs`, generate article pages
5. `views/page.ejs`, generate independent pages

But following files are optional:

1. `views/archive.ejs`, generate archive page
2. `views/tag.ejs`, generate summary page of tags
3. `views/category.ejs`, generate summary page of categories
4. `<yourtheme>/config.yml`, config your theme

**Attention: all static files referenced in view templates and markdown source files must use absolute path**

When write view templates, you must know what is those template data. The main program will process config files of site and theme, markdown source files and execute plugin functions to assemble all data in a object named `locals`, it is the template data object.

```js
locals = {
    // configuration
    config: {
        site: {
            host: 'http://blog.me',
            title: 'title of blog',
            description: 'description of blog'
        },
        contact: {
            email: 'your.gmail.com',
            weibo: 'your.weibo.com',
            github: 'your.github.com'
        },
        // configuration of theme
        themeConfig: { ... }
    },
    // articles and pages
    data: {
        // label could be one of 'index', 'archive', 'tag', 'category' and ${data.page.title}, indicates that which page is beening generated
        label: 'index',
        // all tags attached to articles
        tags: {
            JavaScript: [article_1, article_2, article_3, ...],
            Python: [article_1, article_2, article_3, ...]
        },
        // all categories attached to articles
        categories: {
            frontend: [article_1, article_2, article_3, ...],
            database: [article_1, article_2, article_3, ...]
        },
        // archive of all articles
        archives: {
            "2017": {
                "06": [article_1, article_2, article_3, ...],
                "07": [article_1, article_2, article_3, ...]
            },
            "2016": {
                "08": [article_1, article_2, article_3, ...],
                "09": [article_1, article_2, article_3, ....]
            }
        },
        // independent pages
        pageLinks: {
            about: '/page/about.html'
        },
        // articles in various index pages
        articles: [article_1, article_2, article_3, ....],
        // article data in article page 
        article: {
            title: 'study javascript',
            tags: ['javascript', 'node'],
            category: 'frontend',
            createdTime: '2017-01-01 09:00',
            content: 'html string of content',
            abstract: 'html string of abstract',
            filename: 'study_javascript.html'
        },
        // page data in independent page
        page: {
            title: 'about',
            createdTime: '2017-01-01 09:00',
            content: 'html string of content',
            filename: 'about.html'
        }
    },
    // result returned by plugin function
    plugins: {
        tagcloud: '<div class="tag-cloud">...</div>'
    }
}
```

# Create plugins

Every plugin module should export a function, once you place a plugin in `/plugins` directory, plugin module will be required and function exported will be called with seven arguments automatically, the seven arguments are `config`, `articles`,  `pages`, `tags`, `categories`, `archives`, `pageLinks`, return value of plugin function will be inserted to `locals.plugins`.

# License

MIT license