var gulp    =  require('gulp'),
    gutil   =  require('gulp-util'),
    uglify  =  require('gulp-uglify'),
    concat  =  require('gulp-concat'),
    replace  =  require('gulp-replace'),
    minify = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
	merge = require('merge-stream');

	var argv = require("yargs").argv;




function build(folder,env){
	//if it's dev environment we minify it
	var toMinify = env != "dev";

	var js =  gulp.src(['./src/parts/'+ folder + '/assets/js/*.js','!./src/parts/' + folder + '/assets/js/' +folder + '*.js'])
		        .pipe(gulpif(toMinify,concat(folder+".min.js"),concat(folder+".js")))
		        .pipe(gulpif(toMinify, uglify()))
		        .pipe(gulpif(toMinify, gulp.dest('./dist/parts/'+folder+'/assets/js'),gulp.dest('./src/parts/'+folder+'/assets/js')));

	var css = gulp.src(['./src/parts/'+folder+'/assets/css/*.css','!./src/parts/'+folder+'/assets/css/'+folder+'*.css'])
				.pipe(gulpif(toMinify,concat(folder+".min.css"),concat(folder+".css")))
				.pipe(gulpif(toMinify, minify()))
				.pipe(gulpif(toMinify, gulp.dest('./dist/parts/'+folder+'/assets/css'),gulp.dest('./src/parts/'+folder+'/assets/css')));

	

	return merge(js, css);

}


gulp.task('sokoban', function () {
	return build("sokoban",argv.env);
});

gulp.task('japan', function () {
	return build("japan",argv.env);
});


gulp.task('issunriver', function () {
	return build("issunriver",argv.env);
});

gulp.task('stomachjump', function () {
	return build("stomachjump",argv.env);
});

gulp.task('arrivee', function () {
	return build("arrivee",argv.env);
});

gulp.task('depart', function () {
	return build("depart",argv.env);
});

gulp.task('intro', function () {
	return build("intro",argv.env);
});

gulp.task('ogre', function () {
	return build("ogre",argv.env);
});

gulp.task('buildMain', function () {
	return build("ogre",argv.env);
});


gulp.task("main",function(){

	//if it's dev environment we minify it
	var toMinify = argv.env != "dev";


	var js =  gulp.src(['./src/assets/js/jquery.min.js','./src/assets/js/*.js','!./src/assets/js/oboro*.js'])
		        .pipe(gulpif(toMinify,concat("oboro.min.js"),concat("oboro.js")))
		        .pipe(gulpif(toMinify, uglify()))
		       	.pipe(gulpif(toMinify, gulp.dest('./dist/assets/js'),gulp.dest('./src/assets/js')))
		       	.on('end', gulpif(toMinify,changeFile,function(){}));

	var css = gulp.src(['./src/assets/css/reset.css','./src/assets/css/*.css','!./src/assets/css/oboro*.css'])
				.pipe(gulpif(toMinify,concat("oboro.min.css"),concat("oboro.css")))
				.pipe(gulpif(toMinify, minify()))
				.pipe(gulpif(toMinify, gulp.dest('./dist/assets/css'),gulp.dest('./src/assets/css')));

			
	return merge(js, css);

});

function changeFile(){
	var replaceApp =  gulp.src(['./dist/assets/js/oboro.min.js'])
    	.pipe(replace('var suffix="";', 'var suffix=".min";'))
    	.pipe(gulp.dest('./dist/assets/js'));	
   
   return replaceApp
}		       	

gulp.task('build', function() {
  runSequence('sokoban','issunriver','stomachjump','main','ogre','depart','arrivee','intro','japan',function(){
  	console.log("build finished");
  });
});
