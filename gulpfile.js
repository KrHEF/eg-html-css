const {dest, task, series, src, parallel, watch} = require('gulp'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    fileInclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin');

task('sass', () => {
    return src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./dist'))
        .pipe(connect.reload());
});

task('html', () => {
    return src(['./src/html/index.html'])
        .pipe(fileInclude({
            basepath: `${__dirname}/src`,
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist'))
        .pipe(connect.reload());
});

task('icons', () => {
    return src('./node_modules/feather-icons/dist/feather-sprite.svg')
        .pipe(rename('sprite.svg'))
        .pipe(dest('./dist/icons'))
        .pipe(src('./node_modules/feather-icons/dist/icons/*.svg'))
        .pipe(dest('./dist/icons'))
        .pipe(connect.reload());
});

task('images', () => {
    return src('./src/assets/images/*')
        .pipe(dest('./dist/images'))
        .pipe(connect.reload());
});

task('server', (cb) => {
    connect.server({
        root: 'dist',
        port: 8080,
        livereload: true,
    });
    cb();
});

task('watch', (cb) => {
    watch('./src/sass/**/*.scss', series('sass'));
    watch('./src/html/**/*.html', series('html'));
    cb();
});

task('default', series(parallel('sass', 'html', 'icons', 'images'), 'watch', 'server'));
