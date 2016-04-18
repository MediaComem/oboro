var gulp    = require('gulp'),
    gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('js', function () {
    gulp.src(['./assets/js/*.js','!assets/js/oboro.js'])
        .pipe(uglify())
        .pipe(concat('oboro.js'))
        .pipe(gulp.dest('./assets/js'));
});