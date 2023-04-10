const {src, dest, watch, parallel, series} = require('gulp');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
// html
const fileinclude = require('gulp-file-include');
// css
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// js
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
// img
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');

const path = {
	build: {
		html: 'build/',
		css: 'build/css/',
		js: 'build/js/',
		img: 'build/img/'
	},
	src: {
		html: 'src/*.html',
		scss: 'src/scss/*.scss',
		js: 'src/js/*.js',
		img: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
	},
	watch: {
		html: 'src/**/*.html',
		scss: 'src/scss/**/*.scss',
		js: 'src/js/**/*.js',
		img: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
	}
}

function cleanBuild() {
	return src(path.build.html, {allowEmpty: true})
		.pipe(clean())
}

function buildHtml() {
	return src([path.src.html])
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}

function buildStyles() {
	return src(path.src.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(concat('style.css'))
		.pipe(dest(path.build.css))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
}

function buildScripts() {
	return src([path.src.js, 'src/js/vendor/vendor.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(dest(path.build.js))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

function buildImages() {
	return src(path.src.img)
		.pipe(imagemin())
		// .pipe(webp())
		.pipe(dest(path.build.img))
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: path.build.html
		}
	});
}

function watching() {
	watch([path.watch.html], buildHtml);
	watch([path.watch.scss], buildStyles);
	watch([path.watch.js], buildScripts);
	watch([path.watch.img], buildImages);
}

exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.buildImages = buildImages;
exports.browsersync = browsersync;
exports.watching = watching;

exports.default = series(cleanBuild, parallel(buildHtml, buildStyles, buildScripts, buildImages), parallel(browsersync, watching));