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

		return merge(
		[
			tsStream.dts.pipe(gulp.dest('./bin/')),
			tsStream.js.pipe(gulp.dest('./bin/'))
		]);
	});

	gulp.task("default", function()
	{
		gulp.start(["ts"]);
	});
}

// compiling sample_game
{

	// copies the game assets to the bin folder
	gulp.task("sg_assets", function()
	{
		return gulp.src("./sample_game/assets/**/*.{png,json,jpg,mp3,wav}")
		.pipe(gulp.dest("./sample_game/bin/assets"));
	});

	// copies the default app setup for Electron to the bin folder along with foster.js
	gulp.task("sg_app", function()
	{
		return gulp.src(["./electron/*", "./bin/foster.js", "!./electron/**/*.md"])
		.pipe(gulp.dest("./sample_game/bin"));
	});

	// compiles the sample game typescript
	gulp.task("sg_ts", function()
	{
		return gulp.src("./sample_game/src/**/*.ts")
		.pipe(ts({ out: "game.js", target: "es6" }))
		.pipe(gulp.dest("./sample_game/bin"));
	});

	// cleans the bin folder
	gulp.task("sg_clean", function()
	{
		return del(['./sample_game/bin']);
	});

	// compiles the sample game
	gulp.task("sample_game", ["sg_clean"], function()
	{
		gulp.start(["sg_assets", "sg_app", "sg_ts"]);
	});
}