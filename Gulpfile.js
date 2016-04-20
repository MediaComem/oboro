var gulp    =  require('gulp'),
    gutil   =  require('gulp-util'),
    uglify  =  require('gulp-uglify'),
    rename  =  require("gulp-rename"), 
    concat  =  require('gulp-concat');

gulp.task('js', function () {
    gulp.src(['**/*.js','!node_modules/**/*.js'])
        .pipe(uglify())
        .pipe(rename(function(path){
    		console.log(path);        
  		}))
        .pipe(concat('oboro.js'))
        .pipe(gulp.dest('./assets/js'));
});