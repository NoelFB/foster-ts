var gulp = require("gulp"),
    ts = require("gulp-typescript")
    merge = require("merge2");

var tsProject = ts.createProject('./tsconfig.json');

gulp.task("typescript", function()
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
	gulp.start(["typescript"]);
})
