var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var del = require('del');
var environments = require('gulp-environments');

var development = environments.development;
var production = environments.production;

gulp.task('lint', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('process-js', ['lint'], function() {
    // Grabs the app.js file
    return browserify('./src/app.js')
    // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(production(), uglify()))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('process-css', function() {
    gulp.src('./src/**/*.css')
        .pipe(concat('bundle.css'))
        .pipe(gulpif(production(), minifyCSS()))
        .pipe(gulpif(production(), rename('bundle.min.css')))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('process-static', function() {
    gulp.src(['./src/**/*.html', './src/fonts/*'], {base: 'src'})
        .pipe(gulp.dest('./public'))
});

gulp.task('clean', function () {
    return del(['./public/**/*']);
});

gulp.task('build', ['clean', 'process-js', 'process-css', 'process-static'], function(){
    console.log('Build complete');
});

gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "./public",
            routes: {
                "/node_modules": "node_modules"
            }
        },
        browser:"chrome"
    });
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch('./src/**/*.js', ['process-js']);
    gulp.watch("./src/**/*.css", ["process-css"]);
    gulp.watch("./src/**/*.html", ["process-static"]);
    gulp.watch("./public/**/*.*").on('change', browserSync.reload);
});

gulp.task('deploy', ['build'], function() {
    gulp.src('./public/**/*')
        .pipe(gulp.dest('../ContactApi/src/main/webapp'))
});
