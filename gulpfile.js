"use strict";

var gulp = require("gulp"),
	browserSync = require("browser-sync"),
    less = require("gulp-less"),
	babel = require("gulp-babel");

var config = {
	js: [
		"./minesweeper.js"
	],
    mainLess: "./main.less"
};

gulp.task("default", ["browserSync"], function() {
	gulp.watch(config.js, ["js"]);
    gulp.watch(config.mainLess, ["less"]);
});

gulp.task("js", function() {
	return gulp.src(config.js)
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
})

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
