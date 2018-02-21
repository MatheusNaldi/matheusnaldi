const gulp                 = require('gulp');
const $                    = require('gulp-load-plugins')();
const eslintify            = require('eslintify');
const babelify             = require('babelify');
const env                  = require('dotenv').load().parsed;
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const autoprefix = new LessPluginAutoPrefix({
  browsers: ['last 2 versions']
});

gulp.task('browserify', function () {
  gulp.src('src/js/app.js', {
    read: false
  })
    .pipe($.bro({
      transform: [
        [eslintify, {'quiet-ignored': true}], babelify,
      ],
      error: $.notify.onError('Error: <%= error.message %>'),
      debug: true
    }))
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe(gulp.dest('public/js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.init({
      identityMap: true,
      loadMaps: true,
      debug: true
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./', {
      sourceMappingURL: function(file) {
        return env.APP_URL.replace(/http(s)?:/, '') + '/js/' + file.relative + '.map?v=' + String(Number(new Date));
      }
    }))
    .pipe(gulp.dest('public/js'))
    .pipe($.notify('Build de Javascript finalizada'));
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

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'src/js/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', ['css', 'browserify'], function () {
  gulp.watch('src/less/**/*.less', ['css']);
  gulp.watch('src/js/**/*.js', ['browserify']);
});
