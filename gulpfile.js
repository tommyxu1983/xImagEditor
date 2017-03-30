var gulp = require('gulp');
var fs = require('fs');
var replace = require('gulp-replace-task');

var	uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');


var files = [
	'src/helpers/guid.js',
	'src/helpers/utils.js',
	'src/helpers/EventProxy.js',
	'src/helpers/matrix.js',
	'src/Transformable.js',
	'src/Animation.js',
	'src/Drag.js',
	'src/Element.js',
	'src/Storage.js',
	'src/Container.js',
	'src/XContext.js',
	'src/XCanvas.js',
	'src/container/Layer.js',
	'src/container/Stage.js',
	'src/Shape.js',
	'src/shape/Circle.js',
	'src/shape/Rect.js',
	'src/shape/Image.js',
	'src/Grey16bit/Image16bit.js',
	'src/shape/CustomShape.js',
	'src/filters/Brighten.js',
	'src/filters/ContrastTo.js'
];


//var version = '0.02';
gulp.task('concat',function(){

	return	gulp.src(files)
		.pipe(concat('XIEModulePacked.temp.js'))
		.pipe(gulp.dest('dist/js/pack'));
});

gulp.task('build', ['concat'],function(){
	gulp.src('src/XIEGlobal.js')
		.pipe(replace({
			patterns: [
				{
					match: 'include',
					replace: fs.readFileSync('dist/js/pack/'+'XIEModulePacked.temp.js','utf-8')
				}
			]
		}))
		.pipe(gulp.dest('dist/js'))
});

