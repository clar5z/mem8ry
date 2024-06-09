const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");

function css() {
    return gulp
        .src("./scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
}

function browser() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        https: true,
    });
}

function watch() {
    gulp.watch("./scss/**/*.scss", css);
    gulp.watch("./*.html", browser).on("change", browserSync.reload);
    gulp.on("change", browserSync.reload);
}

exports.css = css;
exports.browser = browser;

exports.default = watch;
