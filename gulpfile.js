const gulp                 = require('gulp');
const $                    = require('gulp-load-plugins')();
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const autoprefix = new LessPluginAutoPrefix({
  browsers: ['last 2 versions']
});

gulp.task('css', function () {
  gulp.src('src/less/style.less')
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('public/css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.csso())
    .pipe(gulp.dest('public/css'))
    .pipe($.notify('Build de CSS finalizada'));
});

gulp.task('watch', ['css'], function () {
  gulp.watch('src/less/**/*.less', ['css']);
});
