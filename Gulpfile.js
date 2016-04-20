var gulp    =  require('gulp'),
    gutil   =  require('gulp-util'),
    uglify  =  require('gulp-uglify'),
    concat  =  require('gulp-concat'),
    minify = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
	merge = require('merge-stream');

	var argv = require("yargs").argv;


gulp.task('sokoban-min', function () {
	var js =  gulp.src('./sokoban/**/*.js')
		        .pipe(uglify())
		        .pipe(concat('sokoban.min.js'))
		        .pipe(gulp.dest('./sokoban/assets/js'));

	var css = gulp.src('./sokoban/**/*.css')
				.pipe(concat("sokoban.min.css"))
				.pipe(minify())
				.pipe(gulp.dest('./sokoban/assets/css'))     

	return merge(js, css);
    
});



function build(folder,env){
	//if it's dev environment we minify it
	var toMinify = env != "dev";


	var js =  gulp.src(['./'+ folder + '/**/*.js','!./' + folder + '/**/' +folder + '*.js'])
		        .pipe(gulpif(toMinify,concat(folder+".min.js"),concat(folder+".js")))
		        .pipe(gulpif(toMinify, uglify()))
		        .pipe(gulp.dest('./'+folder+'/assets/js'));

	var css = gulp.src(['./'+folder+'/**/*.js','!./'+folder+'/**/'+folder+'*.css'])
				.pipe(gulpif(toMinify,concat(folder+".min.css"),concat(folder+".css")))
				.pipe(gulpif(toMinify, minify()))
				.pipe(gulp.dest('./'+folder+'/assets/css'))     

	return merge(js, css);

}


gulp.task('sokoban', function () {
	return build("sokoban",argv.env);
});


gulp.task('pingouin', function () {
	return build("pingouin",argv.env);
});

gulp.task('stomachjump', function () {
	return build("stomachjump",argv.env);
});


gulp.task("main",function(){

	//if it's dev environment we minify it
	var toMinify = argv.env != "dev";


	var js =  gulp.src(['./assets/js/*.js','!./assets/js/oboro*.js'])
		        .pipe(gulpif(toMinify,concat("oboro.min.js"),concat("oboro.js")))
		        .pipe(gulpif(toMinify, uglify()))
		        .pipe(gulp.dest('./assets/js'));

	var css = gulp.src(['./assets/css/*.css','!./assets/js/oboro*.css'])
				.pipe(gulpif(toMinify,concat("oboro.min.css"),concat("oboro.css")))
				.pipe(gulpif(toMinify, minify()))
				.pipe(gulp.dest('./assets/css'))   

	return merge(js, css);

});

gulp.task('build', function() {
  runSequence('sokoban','pingouin','stomachjump','main',function(){
  	console.log("build finished");
  });
});



