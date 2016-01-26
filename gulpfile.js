const gulp = require('gulp');

const babel = require('gulp-babel');
gulp.task('babel', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

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

gulp.task("default", ["babel", "less", "html"]);