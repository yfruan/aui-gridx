var gulp = require('gulp'),
		templateCache = require('gulp-angular-templatecache'),
		//minifyHtml = require('gulp-minify-html'),
		babel = require('gulp-babel');
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
		less = require('gulp-less'),
		path = require('path');

var paths = {
	js: ['./src/js/*.js', './src/js/**/*.js'],
	less: ['./src/less/Gridx.less'],
	templates: ['./src/templates/*.html'],
	resources: ['./src/resources/**/']
};

gulp.task('templates', function() {
  return gulp.src(paths.templates)
   .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache({
      module: 'aui.gridx.templates',
      standalone: true,
      /**
       * Here, I'm removing .html so that `$templateCache` holds
       * the template in `views/home` instead of `views/home.html`.
       * I'm keeping the directory structure for the template's name
       */
      transformUrl: function(url) {
        return url.replace(path.extname(url), '')
      }
    }))
    //put all those to our javascript file
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./src/js'));
})

// js  task
gulp.task('js', function() {
  gulp.src(paths.js)
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
	.pipe(concat('aui-gridx.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./release'));
});

// less  task
gulp.task('less', function() {
  gulp.src(paths.less)
	.pipe(less())
	.pipe(gulp.dest('./release/theme'));
});

gulp.task('resources', function() {
  gulp.src(paths.resources)
	.pipe(gulp.dest('./release/theme/resources/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.less, ['less']);
	gulp.watch(paths.templates, ['templates']);
	gulp.watch(paths.resources, ['resources']);
});
