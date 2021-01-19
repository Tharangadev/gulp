var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cleanCSS = require("gulp-clean-css");
var del = require("del");
var concat = require("gulp-concat");
var connect = require("gulp-connect");

var paths = {
  styles: {
    src: "./scss/*.scss",
    dest: "assets/styles/",
  },
  scripts: {
    src: "./js/*.js",
    dest: "assets/scripts/",
  },
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(["assets"]);
}

// live server
gulp.task("connect", function () {
  connect.server({
    root: "app",
    livereload: true,
    port: 8000,
    livereload: true,
  });
});

/*
 * Define our tasks using plain functions
 */
function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(sass())
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(
        rename({
          basename: "main",
          suffix: ".min",
        })
      )
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(connect.reload())
  );
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(connect.reload());
}

function watch() {
  connect.server();
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
