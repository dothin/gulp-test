/*
* @Author: gaohuabin
* @Date:   2016-04-11 11:43:10
* @Last Modified by:   gaohuabin
* @Last Modified time: 2016-04-13 17:12:09
*/
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

var paths={
    script:['./js/index.js','./js/test.js']
}

gulp.task('jsLint', function () {
    return gulp.src(paths.script)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter()); // 输出检查结果
});

gulp.task('imagemin',function(){
    return gulp.src('./images/*.{png,jpg,gif,ico}')
        .pipe(plugins.imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片(无损压缩)
            }))
        .pipe(gulp.dest('./dist/images'));
})

gulp.task('minifyHtml', function () {
    return gulp.src('./*.html')
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest('dist/html'))
    .pipe(plugins.livereload());
});

gulp.task('compass',function(){
    return gulp.src('./sass/*.scss')
    .pipe(plugins.compass({
      config_file: './config.rb',
      css: './dist/css',
      sass: './sass'
    }))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(plugins.livereload());
})

gulp.task('watch',function(){
    plugins.livereload.listen();
    gulp.watch('./sass/*.scss',['compass']);
    gulp.watch('./*.html',['minifyHtml']);
})

gulp.task('default',['watch','imagemin','compass','minifyHtml','jsLint'],function(){
    return gulp.src(paths.script)
    .pipe(plugins.browserify())
    .pipe(plugins.uglify())
    .pipe(plugins.concat('all.min.js'))
    .pipe(gulp.dest('./dist/js'));
});
