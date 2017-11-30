var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var pngquant = require('imagemin-pngquant');
var MozJpeg = require('imagemin-mozjpeg');
var gifsicle = require('imagemin-gifsicle');
var imageminSvgo = require('imagemin-svgo');
var plugins = gulpLoadPlugins();
var browserSync = require('browser-sync').create();

var args = require('yargs').argv;
var config = require('./' + (args.template ? args.template : 'main') + '.config.json').config;

var configWebserver = {
	server: {
		baseDir: config.src.server
	},
	open: false,
	host: 'localhost',
	logPrefix: 'FrontEnd Builder'
};

gulp.task('webserver', () => {
	browserSync.init(configWebserver);
});

// build project
gulp.task('build', () => {

	gulp.src(config.src.dev.files)
		.pipe(gulp.dest(config.src.build.dest))

});

gulp.task('js', () => {

	gulp.src(config.src.source.js.dest)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
				console.log(err)
			}
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('script.js'))
		.pipe(plugins.rename('script.min.js'))
		.pipe(plugins.if(config.compress.js, plugins.uglify()))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(config.src.dev.js.dest))
		.on('end', browserSync.reload);

	gulp.src(config.src.source.js.jquery)
		.pipe(gulp.dest(config.src.dev.js.dest));

});

gulp.task('css', () => {

	var importAt = require('postcss-import');
	var nested = require('postcss-nested');
	var mixins = require('postcss-mixins');
	var simpleVars = require('postcss-simple-vars');
	var cssnano = require('cssnano');
	var inlineSvg = require('postcss-inline-svg');
	var svgo = require('postcss-svgo');
	var cssnext = require('postcss-cssnext');
	var imageInliner = require('postcss-image-inliner');

	var processors = [
		importAt,
		mixins,
		cssnext,
		nested,
		simpleVars,
		inlineSvg({
			path: config.src.source.svg.dest,
			removeFill: true
		}),
		imageInliner({
			assetPaths: ["https://icongr.am"]
		}),
		svgo,
		cssnano
	];

	return gulp.src(config.src.source.css.dest)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
				console.log(err)
			}
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.postcss(processors))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(config.src.dev.css.dest))
		.on('end', browserSync.reload);
});

var configHtml = {
	'indent_size': 1,
    'indent_char': '\t',
    'max_char': 78,
    'brace_style': 'expand',
    'unformatted': ['sub', 'sup', 'b', 'u']
}

gulp.task('ajax', () => {
	return gulp.src(config.src.source.ajax.dest)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
				console.log(err)
			}
		}))
		.pipe(plugins.nunjucksRender({
			path: [config.src.source.components]
		}))
		.pipe(plugins.htmlPrettify(configHtml))
		.pipe(gulp.dest(config.src.dev.ajax.dest))

});

gulp.task('nunjucks', () => {
	return gulp.src(config.src.source.html.dest)
		.pipe(plugins.plumber({
			errorHandler: (err) => {
				console.log(err)
			}
		}))
		.pipe(plugins.nunjucksRender({
			path: [config.src.source.components]
		}))
		.pipe(plugins.htmlPrettify(configHtml))
		.pipe(gulp.dest(config.src.dev.dest))
		.on('end', browserSync.reload);

});

gulp.task('fonts', () => {
	return gulp.src(config.src.source.fonts.dest)
		.pipe(gulp.dest(config.src.dev.fonts.dest));
});

gulp.task('images', function () {

	return gulp.src(config.src.source.images.dest)
		.pipe(plugins.cache(plugins.imagemin([
			plugins.imagemin.gifsicle({
				interlaced: true
			}),
			MozJpeg({
				quality: 90
			}),
			plugins.imagemin.optipng({
				optimizationLevel: 5
			}),
			plugins.imagemin.svgo({
				plugins: [{removeViewBox: true}]
			})
		])))
		.pipe(gulp.dest(config.src.dev.images.dest))
		.on('end', browserSync.reload);
});

gulp.task('watch:nunjucks', () => {
	plugins.watch(config.src.watch.html, () => {
		gulp.start('nunjucks');
	});
});

gulp.task('watch:ajax', () => {
	plugins.watch(config.src.watch.ajax, () => {
		gulp.start('ajax');
	});
});

gulp.task('watch:css', () => {
	plugins.watch(config.src.watch.css, () => {
		gulp.start('css');
	});
});

gulp.task('watch:js', () => {
	plugins.watch(config.src.watch.js, () => {
		gulp.start('js');
	});
});

gulp.task('watch:images', () => {
	plugins.watch(config.src.watch.images, () => {
		gulp.start('images');
	});
});

gulp.task('watch', () => {
	plugins.watch(config.src.watch.html, () => {
		gulp.start('nunjucks');
	});
	plugins.watch(config.src.watch.ajax, () => {
		gulp.start('ajax');
	});
	plugins.watch(config.src.watch.css, () => {
		gulp.start('css');
	});
	plugins.watch(config.src.watch.js, () => {
		gulp.start('js');
	});
	plugins.watch(config.src.watch.images, () => {
		gulp.start('images');
	});
});

gulp.task('default', ['watch', 'webserver']);
gulp.task('dev', ['js', 'nunjucks', 'css', 'ajax', 'fonts']);
