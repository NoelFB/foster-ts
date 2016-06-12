var gulp = require("gulp"),
    ts = require("gulp-typescript")
    merge = require("merge2"),
	del = require('del');

// compiling foster
{
	var tsProject = ts.createProject('./tsconfig.json');

	gulp.task("ts", function()
	{	
		var tsStream = tsProject.src()
		.pipe(ts(tsProject));

		return merge([
			tsStream.dts.pipe(gulp.dest('./bin/')),
			tsStream.js.pipe(gulp.dest('./bin/'))
		]);
	});

	gulp.task("default", function()
	{
		gulp.start(["ts"]);
	})
}

// compiling sample_game
{
	gulp.task("sg_assets", function()
	{
		return gulp.src("./sample_game/assets/*")
		.pipe(gulp.dest("./sample_game/bin/assets"));
	});

	gulp.task("sg_core", function()
	{
		return gulp.src(["./sample_game/core/*", "./bin/foster.js"])
		.pipe(gulp.dest("./sample_game/bin"));
	});

	gulp.task("sg_ts", function()
	{
		return gulp.src("./sample_game/src/**/*.ts")
		.pipe(ts({ out: "game.js", target: "es6" }))
		.pipe(gulp.dest("./sample_game/bin"));
	});

	gulp.task("sg_clean", function()
	{
		return del(['./sample_game/bin']);
	});

	gulp.task("sample_game", ["sg_clean"], function()
	{
		gulp.start(["sg_assets", "sg_core", "sg_ts"]);
	});
}