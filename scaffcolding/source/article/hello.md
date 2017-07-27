---
title: hello
tags: ['pencil', 'doc']
category: pencil
filename:
createdTime: 2017-07-22 08:04
---
### 段落
这是一款用于生成静态博客的命令行工具, 开发语言为Node.js, 采用[Markdown](http://www.appinn.com/markdown/)的形式书写博客文章，采用Git进行博客站点的部署

使用方法：

1. 安装Git和Node
2. 全局安装: `npm install pencil --global`
3. 查看帮助信息：`pencil help`
4. 初始化一个新的站点：`pencil init ./blog`, 并切换工作目录至`./blog`
5. 创建一篇新的文章草稿: `pencil create article "hello world"`, 并编辑`./blog/source/draft/article/hello_world.md`
6. 发布文章草稿: `pencil publish article "hello world"`
7. 生成站点：`pencil generate`
8. 站点预览: `pencil server`
9. 内容推送: `pencil push`

### 引用
> 这是一个段落引用

### 无序列表
+ item-1
+ item-1
+ item-3

### 代码
```js
function introduce() {
    console.log('Pencil is a command line tool for static blog')
}
introduce();
```

### 表格
| header | header | header |
|--------|--------|--------|
| item   | item   | item   |
| item   | item   | item   |
| item   | item   | item   |
| item   | item   | item   |

### 图片
![tangwei](/assets/tangwei.jpg "汤唯")
