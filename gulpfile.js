'use strict';
//const gulp = require('gulp');
//
//
//
//const watchify = require('watchify');
//const browserify = require('browserify');
//const source = require('vinyl-source-stream');
//const buffer = require('vinyl-buffer');
//const gutil = require('gulp-util');
//const sourcemaps = require('gulp-sourcemaps');
//const assign = require('lodash.assign');
//
//// add custom browserify options here
//const customOpts = {
//    entries: ['tmp/original/rules.js'],
//    debug: true
//};
//const opts = assign({}, watchify.args, customOpts);
//const b = watchify(browserify(opts));
//
//// add transformations here
//// i.e. b.transform(coffeeify);
//
//gulp.task('js', bundle); // so you can run `gulp js` to build the file
//b.on('update', bundle); // on any dep update, runs the bundler
//b.on('log', gutil.log); // output build logs to terminal
//
//function bundle() {
//    return b.bundle()
//        // log errors if they happen
//        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
//        .pipe(source('bundle.js'))
//        // optional, remove if you don't need to buffer file contents
//        .pipe(buffer())
//        // optional, remove if you dont want sourcemaps
//        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
//        // Add transformation tasks to the pipeline here.
//        .pipe(sourcemaps.write('./')) // writes .map file
//        .pipe(gulp.dest('./dist'));
//}
//
//
//
//
//
//
//
//const babel = require('gulp-babel');
//gulp.task('babel', () => {
//    return gulp.src('src/**/*.js')
//        .pipe(babel({
//            presets: ['es2015']
//        }))
//        .pipe(gulp.dest('tmp'));
//});
//
//const less = require('gulp-less');
//const path = require('path');
//gulp.task('less', () => {
//    return gulp.src('src/**/*.less')
//        .pipe(less({
//            paths: [ path.join(__dirname, 'less', 'includes') ]
//        }))
//        .pipe(gulp.dest('dist'));
//});
//
//gulp.task("html", () => {
//    return gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
//});
//
//gulp.task("default", ["babel", "less", "html", "js"]);






























const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

const customOpts = {
    entries: ['src/js/runner.js'],
    debug: true
};

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
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
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


const less = require('gulp-less');
const path = require('path');
gulp.task('less', () => {
    return gulp.src('src/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task("html", () => {
    return gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
});

gulp.task('default', ['less', 'html', 'watch']);