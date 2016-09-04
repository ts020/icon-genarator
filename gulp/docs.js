'use strict';

//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
import paths from './config';

import gulp from 'gulp';
import jade from 'gulp-jade';
import data from 'gulp-data';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cssGlobbing from 'gulp-css-globbing';
import autoprefixer from 'gulp-autoprefixer';

import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

//---------------------------------------------------------------------------
// BrowserSync
//---------------------------------------------------------------------------
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.docs
    }
  });
});

gulp.task('bs:reload', () => {
  browserSync.reload()
});

//---------------------------------------------------------------------------
// bundlejs
//---------------------------------------------------------------------------
gulp.task('bundle:js', () => {
  browserify({
    entries: './src/js/app.js',
    extensions: ['.js']
  })
  .transform(babelify)
  .bundle()
  .on("error", function (err) {
			console.log('Error : ' + err.message);
			this.emit('end');
		})
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(paths.destJs))
  .pipe(browserSync.reload({ stream: true }));
});

//---------------------------------------------------------------------------
// Jade
//---------------------------------------------------------------------------
gulp.task('jade', () => {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe(data(() => require('../setting.json')))
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.docs))
    .pipe(browserSync.reload({ stream: true }));
});

//---------------------------------------------------------------------------
// Sass
//---------------------------------------------------------------------------
gulp.task('sass', () => {
  return gulp.src(paths.srcScss + '**/*.scss')
    .pipe(cssGlobbing({ extensions: ['.scss'] }))
    .pipe(sass({
      loadPath     : [],
      outputStyle  : 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: 'last 2 versions',
      cascade: false
    }))
    .pipe(gulp.dest(paths.docs + 'css/'))
    .pipe(browserSync.reload({ stream: true }));
});
