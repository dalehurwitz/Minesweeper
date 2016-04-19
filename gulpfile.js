"use strict";

var gulp = require("gulp"),
	browserSync = require("browser-sync"),
    less = require("gulp-less");

var config = {
	js: "./minesweeper.js",
    mainLess: "./main.less"
};

gulp.task("default", ["browserSync"], function() {
	gulp.watch(config.js, browserSync.reload);
    gulp.watch(config.mainLess, ["less"]);
});

gulp.task("less", function() {
    return gulp.src(config.mainLess)
        .pipe(less())
        .pipe(gulp.dest("./"))
        .pipe(browserSync.stream());
    
});

gulp.task("browserSync", function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});
