var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

// HTML Mimifier
gulp.task('htmlmin', function() {
  return gulp.src('./src/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('./dist/'));
});

// Sass
gulp.task('sass', function() {
  return gulp.src('./src/scss/**/*.scss').pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).pipe(gulp.dest('./dist/css'));
});

// Babel
gulp.task('babel', function() {
  return gulp.src('./src/js/**/*.js').pipe(babel()).pipe(gulp.dest('./dist/js'));
});

// BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

// Build
gulp.task('build', ['htmlmin', 'sass', 'babel'],function() {

});

// Run
gulp.task('run', ['browserSync'],function() {

});

// Development
gulp.task('development', ['htmlmin', 'sass', 'babel', 'browserSync'], function() {
  // Watch
  gulp.watch('./src/*.html', ['htmlmin']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['babel']);
  // Reload
  gulp.watch('./dist/*.html', browserSync.reload);
  gulp.watch('./dist/css/**/*.css', browserSync.reload);
  gulp.watch('./dist/js/**/*.js', browserSync.reload);
});
