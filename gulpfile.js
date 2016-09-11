var gulp = require('gulp');
var DEST = 'dist';
var rename = require("gulp-rename");

gulp.task('doc', function (cb) {
	var jsdoc = require('gulp-jsdoc3');
	var config = require('./jsdoc.json');
    gulp.src(['README.md', 'src/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('uglify-compiler', function() {
	var uglify = require('gulp-uglify');
	gulp.src('src/*.js')
		.pipe(uglify({
       preserveComments:'some'
     }))
		.pipe(rename('router.min.js'))
		.pipe(gulp.dest(DEST));
});

gulp.task('default', ['uglify-compiler']);
