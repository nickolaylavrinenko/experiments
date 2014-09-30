
// dependensies
var
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less-sourcemap'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    browserify = require('gulp-browserify'),
    transform = require('vinyl-transform'),
    exorcist = require('exorcist'),
    concat = require('gulp-concat'),
    react = require('gulp-react');

var SRC_JS_DIR = 'src/js';
var SRC_JSX_DIR = 'src/jsx';
var SRC_CSS_DIR = 'src/css';
var OUTPUT_JS_DIR = 'static/js';
var OUTPUT_JSX_DIR = SRC_JS_DIR+'/components';
var OUTPUT_CSS_DIR = 'static/css';

// css processing tasks
gulp.task('process_css', function(){
    gulp.src(SRC_CSS_DIR+'/main.less')
        .pipe(rename('all.css'))
        .pipe(less({generateSourceMap: true}))
        .pipe(gulp.dest(OUTPUT_CSS_DIR));
});

// js processing tasks
gulp.task('compile_jsx', function(callback){
    gulp.src([SRC_JSX_DIR+'/**/*.jsx'])
        .pipe(react())
        .pipe(gulp.dest(OUTPUT_JSX_DIR));
    callback();
});
gulp.task('check_js', ['compile_jsx'], function(callback){
    gulp.src([SRC_JS_DIR+'/**/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    callback();
});
gulp.task('process_js', ['check_js'], function(){
    gulp.src(SRC_JS_DIR+'/main.js')
//        .pipe(rename('all.js'))
        .pipe(browserify({debug: true}))
        .pipe(transform(function () { return exorcist(OUTPUT_JS_DIR+'/all.js.map'); }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest(OUTPUT_JS_DIR));
//        .pipe(rename('all.min.js'))
//        .pipe(uglify())
//        .pipe(gulp.dest(OUTPUT_JS_DIR));
});

// default task
gulp.task('default', ['process_css', 'process_js'], function(){
    var watcher = gulp.watch(['src/js/*.js', 
                              'src/jsx/**/*.jsx', 
                              'src/css/**/*.less', 
                              './gulpfile.js'],
                             ['process_css', 'process_js']);
    watcher.on('change', function(e){
        console.log('File ' + e.path + ' was ' + e.type + ', building project ...');
    });
});
