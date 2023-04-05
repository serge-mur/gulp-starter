const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

const path = {
	build: {
		html: 'build/',
		css: 'build/css/',
		js: 'build/js/'
	},
	src: {
		html: 'src/*.html',
		scss: 'src/scss/style.scss',
		js: 'src/js/script.js'
	},
	watch: {
		html: 'src/**/*.html',
		scss: 'src/scss/**/*.scss',
		js: 'src/js/**/*.js'
	}
}

function cleanBuild() {
	return src(path.build.html, {allowEmpty: true})
		.pipe(clean())
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: path.build.html
		}
	});
}

function buildHtml() {
	return src([path.src.html])
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}

function buildScripts() {
	return src([path.src.js])
		.pipe(concat('script.min.js'))
		.pipe(uglify(/* options */))
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

function buildStyles() {
	return src(path.src.scss)
		.pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
		.pipe(concat('style.min.css'))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
}

function watching() {
	watch([path.watch.html], buildHtml);
	watch([path.watch.scss], buildStyles);
	watch([path.watch.js], buildScripts);
}

exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = series(cleanBuild, buildHtml, buildStyles, buildScripts, parallel(browsersync, watching));