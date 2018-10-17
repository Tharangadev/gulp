var gulp = require('gulp');
let connect = require('gulp-connect');
var sass = require('gulp-sass');

sass.compiler = require('node-sass');


gulp.task("server",()=>{
  connect.server({
    livereload: true
  });
})
gulp.task('scss', function(){
  return gulp.src('scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('css/'))
    .pipe(connect.reload());
});



gulp.task('watch',()=>{
  gulp.watch(['scss/*.scss','./js','index.html'], [ 'scss'])
})


gulp.task('default',['watch','server']);
