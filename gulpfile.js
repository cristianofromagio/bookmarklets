/**
 * refs:
 *   - https://stackoverflow.com/a/36592176 (merge stream)
 */

let 
  gulp = require('gulp'),
  bookmarklet = require('gulp-bookmarklet'),
  merge = require('merge-stream'),
  concat = require('gulp-concat'),
  order = require('gulp-order');

function build() {
  let bookmarks = gulp.src('src/*.js')
    .pipe(bookmarklet({
      format: 'htmlsingle',
      file: 'bookmarks.html'
    }));
  let styling = gulp.src(['src/base/styles.html']);

  return merge(bookmarks, styling)
    .pipe(order(['bookmarks.html', '*.html']))
    .pipe(concat('bookmarklets.html'))
    .pipe(gulp.dest('dist'));
}

exports.build = build;
exports.default = build;
