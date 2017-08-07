const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const plugins = [autoprefixer({brwosers: ['latest 2 version']})];

const www = '../../public';
const cssdir = 'theme_assets/css';
const jsdir = 'theme_assets/js';

// compile site.less to site.css
gulp.task('less', () => {
	gulp.src(`${cssdir}/site.less`)
	.pipe(less())
	.pipe(postcss(plugins))
	.pipe(gulp.dest(cssdir))
	.pipe(gulp.dest(`${www}/${cssdir}`))
	.pipe(browserSync.stream());
});

// start brwoser-sync
gulp.task('serve', () => {
	browserSync.init({
		server: www
	});
	// watch site.less
	gulp.watch(`${cssdir}/site.less`, ['less']);
	// watch site.js
	gulp.watch(`${jsdir}/site.js`, () => {
		gulp.src(`${jsdir}/site.js`)
		.pipe(gulp.dest(`${www}/${jsdir}/site.js`));
		browserSync.reload();
	});
});

// default task
gulp.task('default', ['less', 'serve']);