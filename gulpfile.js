var gulp = require('gulp');
var react = require('gulp-react');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

//Beep only for OSX
function beep() {
  var exec = require('child_process').exec;
  exec('afplay /System/Library/Sounds/Glass.aiff');
}

gulp.task('react', function () {
  return gulp.src('app/scripts/options.jsx')
    .pipe(plumber({
      errorHandler: function (err) {
        beep();
        this.emit('end');
      }
    }))
    .pipe(react())
    .pipe(gulp.dest('app/scripts'));
})

gulp.task('default', function () {
  livereload.listen();
  gulp.watch('app/**')
    .on('change', livereload.changed);
  gulp.watch('app/scripts/options.jsx', ['react'])
})

