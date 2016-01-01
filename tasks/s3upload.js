const gulp = require('gulp');
const s3 = require('vinyl-s3');
const es = require('event-stream');
const packToVinyl = require('npm-pack-to-vinyl');
const config = require('./config').s3upload;

/*
 * Upload packages to S3
 */
gulp.task('s3upload', function() {
  return es.readArray(config.packages)
    .pipe(es.map(packToVinyl))
    .pipe(s3.dest(config.dest));
});
