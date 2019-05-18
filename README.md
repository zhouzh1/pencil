# 关于

这是一个静态博客生成器，就是一个类似hexo的玩意，可以配合Github Page创建免费的个人Blog站点.

# 要求

1. Git
2. Node.js v6.x

# 安装

`npm install pencil-cli -g`.

# 使用方法

1. GitHub创建一个名为`<yourname>.github.io`的仓库并克隆到本地
2. 创建source分支， `git checkout -b source`
3. 初始化站点结构，`pencil init ./`
4. 在`config.yml`文件中配置站点信息
4. 查看帮助信息， `pencil help`

# 站点的目录结构

```
.
|____site
  |____config.yml      # 配置文件
  |____public          # 站点根目录
    |____site_assets   # 存放站点的静态文件
    |____theme_assets  # 存放主题的静态文件
  |____source          # markdown源文件
  |____plugins         # 插件目录
  |____themes          # 主题目录
```

# 部署

将远程Git仓库clone至本地后，必须先切换至**source**分支，`pencil deploy`命令会将本地的**source**分支推送到远程仓库的**source**分支，并且将**public**子目录推送到远程仓库的master分支.

# 创建主题

主题模板使用的是[ejs](https://github.com/tj/ejs), 一个符合规范的主题必须包含下列目录和文件:

1. `views`, 包含所有的ejs模板
2. `theme_assets`, 包含css, js, font等静态资源
3. `views/index.ejs`, 首页模板
4. `views/article.ejs`, 文章详情页模板
5. `views/page.ejs`, 独立页模板

下列文件是可选的:

1. `views/archive.ejs`, 文章归档页模板
2. `views/tag.ejs`, 文章标签页模板
3. `views/category.ejs`, 文章分类页模板
4. `<yourtheme>/config.yml`, 主题配置文件

**注意: 在模板文件中和markdown文件中引用静态资源必须使用站点的绝对路径**

在构建站点的过程中，主程序会对配置文件和markdown文件进行处理，会执行插件函数，并组装出模板所需要的数据，最终的模板数据存储在一个命名为**locals**的对象变量中.

```js
locals = {
    // 配置信息
    config: {
        // 全局站点的配置信息
        site: {
            host: 'https://xx.blog',
            title: '站点标题',
            description: '站点描述'
        },
        // 主题的配置信息
        themeConfig: { 
            [index: string]: any
        }
    },
    // 文章和页面
    data: {
        // 当前构建的页面，可选值有 index | archive | tag | category | ${data.page.title}
        label: 'index',
        // 所有的标签
        tags: {
            'tag_1': [article_1, article_2, ...],
            'tag_2': [article_3, article_4, ...]
        },
        // 所有分类
        categories: {
            'category_1': [article_1, article_2, ...],
            'category_2': [article_1, article_2, ...]
        },
        // 文章归档
        archives: {
            "2019": {
                "06": [article_1, article_2, ...],
                "07": [article_3, article_4, ...]
            },
            "2018": {
                "08": [article_1, article_2, ...],
                "09": [article_1, article_2, ....]
            }
        },
        // 独立页面的链接
        pageLinks: {
            about: '/page/about.html'
        },
        // 索引页（首页）的文章列表，用于分页展示
        articles: [article_1, article_2, article_3, ....],
        // 文章页面的数据 
        article: {
            title: '文章标题',
            tags: ['标签一', '标签二'],
            category: '文章分类',
            createdTime: '2019-08-08 09:00',
            content: '文章类容',
            abstract: '文章摘要',
            filename: '文章标题.html'
        },
        // 独立页面的数据
        page: {
            title: '页面名称',
            createdTime: '2017-01-01 09:00',
            content: '页面内容',
            filename: '页面名称.html'
        }
    },
    // 插件函数返回的html内容
    plugins: {
        pluginName: '<section>...</section>'
    }
}
```

# 创建插件

每个插件都是一个函数，函数签名为：

```js
/**
 * @param {Object} config 配置信息
 * @param {Object} articles 文章信息
 * @param {Object} pages 页面信息
 * @param {Object} tags 标签信息
 * @param {Object} categories 分类信息
 * @param {Object} archives 归档信息
 * @param {Object} pageLinks 页面链接信息
 * @return {String}
 */
function plugin(config, articles, pages, tags, categories, archives, pageLinks) {
    // todo
}
```

# License

MIT license