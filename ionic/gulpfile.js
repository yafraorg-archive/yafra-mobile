var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var through = require('through');

var paths = {
    js: ['./www/js/**/*.js', '../tests/**/*.js'],
    html: ['./www/**/*.html'],
    css: ['./www/css/**/*.css'],
    sass: ['./scss/**/*.scss']
};


gulp.task('default', ['sass', 'lint']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
      .pipe(sass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest('./www/css/'))
      .pipe(minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(rename({ extname: '.min.css' }))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
      .on('log', function(data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
      });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
        '  ' + gutil.colors.red('Git is not installed.'),
        '\n  Git, the version control system, is required to download Ionic.',
        '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
        '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


/* YAFRA.org CUSTOM TAKS */


/* JSHINT */
gulp.task('lint', function() {
    return gulp.src('./www/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(count('jshint', 'files lint free'));
});
function count(taskName, message) {
    var fileCount = 0;

    function countFiles(file) {
        fileCount++; // jshint ignore:line
    }

    function endStream() {
        gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
        this.emit('end'); // jshint ignore:line
    }
    return through(countFiles, endStream);
}

/* KARMA unit tests */
var karma = require('gulp-karma');
gulp.task('tests', function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

/* CHANGELOG creation */
gulp.task('changelog', function(done) {
    var options = {
        repository: 'https://github.com/yafraorg/yafra-mobile',
        version: '1.0.0',
        file: 'CHANGELOG.md'
    };
    if (SHA) {
        options.from = SHA;
    }
    changelog(options, function(err, log) {
        fs.writeFileSync(__dirname + '/CHANGELOG.md', log);
    });
});