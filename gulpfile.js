'use strict';
const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const babelPollyfill = require("babel-polyfill");
const gulpLess = require('gulp-less');
const path = require('path');

const customOpts = {
    entries: ['src/js/runner.js'],
    debug: true
};

function less(){
    return gulp.src('src/**/*.less')
        .pipe(gulpLess({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('dist'));
}

function html(){
    return gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
}


function compile(watch) {
    var bundler = watchify(browserify(customOpts).transform(babel, {presets: ["es2015", "stage-0", "react"]}));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));

        less();
        html();
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling... ' + new Date());
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('less', less);
gulp.task("html", html);

gulp.task('default', ['less', 'html', 'watch']);