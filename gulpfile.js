const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'build/'
		}
	});
}

function buildHtml() {
	return src(['src/*.html'])
		.pipe(dest('build/'))
		.pipe(browserSync.stream());
}

function buildScripts() {
	return src(['src/js/script.js'])
		.pipe(concat('script.min.js'))
		.pipe(uglify(/* options */))
		.pipe(dest('build/js'))
		.pipe(browserSync.stream());
}

function buildStyles() {
	return src('src/scss/style.scss')
		.pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
		.pipe(concat('style.min.css'))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(dest('build/css'))
		.pipe(browserSync.stream());
}

function cleanBuild() {
	return src('build/', {allowEmpty: true})
		.pipe(clean())
}

function watching() {
	watch(['src/**/*.html'], buildHtml);
	watch(['src/scss/**/*.scss'], buildStyles);
	watch(['src/js/**/*.js'], buildScripts);
}

exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = series(cleanBuild, buildHtml, buildStyles, buildScripts, parallel(browsersync, watching));