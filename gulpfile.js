const gulp = require('gulp');
const replace = require('gulp-replace');
const include = require('gulp-include');
const header = require('gulp-header');
const del = require('del');
const exec = require('child_process').exec;
const path = require('path');
const jshint = require('gulp-jshint');
var rename = require('gulp-rename');

var pkg = require('./package.json');
var headerTemplate =
["/**",
" * <%= pkg.com_benrohel.name %> - <%= pkg.description %>",
" * @version v<%= pkg.version %>",
" * @link <%= pkg.homepage %>",
" * @license <%= pkg.license %>",
" */"].join("\n");

function isWindows(){
  var isWin = /^win/.test(process.platform);
  return isWin;
}

function executeScript(absFilePath, callback){
  var shellCommand = isWindows() ? ('"C:\\Program Files\\Adobe\\Adobe After Effects CC 2017\\Support Files\\afterfx.exe" -r '+ absFilePath) :
    ('osascript -e \'tell application "Adobe After Effects CC 2017" to activate\' -e \'tell application "Adobe After Effects CC 2017" to DoScriptFile "'+absFilePath+'"\'');
  exec(shellCommand,callback);
}

gulp.task("runMyScript", ["buildMyScript"], function(done){
  var absPath = path.join(__dirname, "dist/Change-Shapes-Color.jsx");
  executeScript(absPath, function(error, stdout, stderr){
    done();
  });
});


gulp.task("buildMyScript", ["preprocessSources"], function(){
  return gulp.src(".temp/main.jsx")
    .pipe(include())
    .pipe(header(headerTemplate,{pkg:pkg}))
    .pipe(rename("Change-Shapes-Color.jsx"))
    .pipe(gulp.dest("dist"))
  });


gulp.task("preprocessSources", ["clean"],function() {
return gulp.src("src/**/*.jsx")
  .pipe(replace(/^\s*#include/gm,"//= include"))
  .pipe(replace("@@name", pkg.com_benrohel.name))
  .pipe(replace("@@version", pkg.version))
  .pipe(gulp.dest(".temp"));
});

gulp.task("clean", function(){
  return del(['./dist','./.temp']);
});

gulp.task("watch", function(){
  gulp.watch(['src/**/*.js*'], ['lint']);
});


gulp.task("default", ["buildMyScript"]);
