/**
 * refs:
 *  - https://stackoverflow.com/a/36592176 (merge stream)
 *  - https://stackoverflow.com/a/40572663 (browser-sync not reloading)
 *  - https://nightlycommit.github.io/twing/templates.html
 *  - https://stackoverflow.com/questions/67641687/cannot-disable-cache-in-twing-template-engine-node-js-express-js
 *  - https://nightlycommit.github.io/twing/language-reference/tags/include.html
 */

const
  fs = require('fs'),
  { src, dest, watch, series, parallel } = require('gulp'),
  merge = require('merge-stream'),
  concat = require('gulp-concat'),
  order = require('gulp-order'),
  rename = require('gulp-rename'),
  bookmarklet = require('gulp-bookmarklet'),
  change = require('gulp-change'),

  twing = require('gulp-twing'),
  { TwingEnvironment, TwingLoaderRelativeFilesystem } = require('twing'),
  twingEnv = new TwingEnvironment(new TwingLoaderRelativeFilesystem()),
  cheerio = require('cheerio'),

  yargs = require('yargs/yargs'),
  { hideBin } = require('yargs/helpers'),
  argv = yargs(hideBin(process.argv)).argv,

  browserSync = require('browser-sync').create();


// flag to append browser-sync script tag (otherwise it won't auto-reload page)
//  because htmlsingle file generated by gulp-bookmarklet doesn't include
//  a body tag, so browser-sync can't automatically append its script tag
let APPEND_BROWSER_SYNC_TAG = false;

function appendBrowserSyncTag(cb) {
  APPEND_BROWSER_SYNC_TAG = true;
  cb();
}

// flag to automatically ignore scripts in development (marked with starting _)
//  this is useful to leave unfinished scripts out of prod build (publish)
let IGNORE_UNFINISHED_SCRIPTS = false;

function ignoreUnfinishedScripts(cb) {
  IGNORE_UNFINISHED_SCRIPTS = true;
  cb();
}

function transformInputStringIntoArray(args) {
  // if args is passed without values
  if (!args || typeof args === 'boolean') return [];

  let str = args.toString().trim();
  if (str.substring(str.length, str.length - 1) === ',') {
    str = str.slice(0, -1);
  }
  return str.split(',');
}

const scriptsArg = argv.logs;
let logScriptsArr = transformInputStringIntoArray(scriptsArg);

function newScript(cb) {

  const args = yargs(hideBin(process.argv))
    .help(false)
    .version(false)
    .option('name', {
      alias: 'n',
      describe: 'choose script name'
    })
    .option('type', {
      alias: 't',
      describe: 'choose new script type',
      choices: ['basic', 'togglable', 'miniapp', 'dialog'],
      default: 'basic'
    })
    .demandOption(['name', 'type'], 'Please provide a name and a valid type')
    .fail(function (msg, err, yargs) {
      if (err) throw err;
      console.error(msg);
      console.error(yargs.help());

      cb();

      process.exit(1);
    })
    .parse();

  return src('src/building_blocks/stubs/'+ args.type +'.js.twig')
    .pipe(twing(
      twingEnv,
      {
        scriptName: args.name
      },
      { outputExt: '' }
    ))
    .pipe(rename((path) => {
      path.basename = '_' + args.name;
    }))
    .pipe(dest('src'));

}


function build() {
  // needed to bypass twing caching mechanism,
  //  otherwise would not reflect changes while watching files changes
  const twingEnv = new TwingEnvironment(new TwingLoaderRelativeFilesystem());

  // this provides us a way to use twing templating "tags"
  //  while still using js/css/html syntax highlight from the editor
  function removeTwingPlaceholders(content) {
    return content
      .replaceAll("// @twing ", "")         // js
      .replaceAll("// @twing-include ", "") // js
      .replaceAll("/* @twing-start", "")    // js/css
      .replaceAll("@twing-end */", "")      // js/css
      .replaceAll("<!-- @twing-start", "")  // html
      .replaceAll("@twing-end -->", "");    // html
  }

  function logScripts(content) {
    logScriptsArr.forEach((scriptName) => {
      if (content.indexOf(scriptName) > 0) {
        console.log(scriptName + ' content:');
        console.log(content);
      }
    });
  }

  let scriptsGlob = ['src/*.js'];

  if (IGNORE_UNFINISHED_SCRIPTS) {
    scriptsGlob.push('!src/_*.js');
  }

  let bookmarks = src(scriptsGlob)
    .pipe(twing(
      twingEnv,
      {},
      { outputExt: '' }
    ))
    .pipe(change(removeTwingPlaceholders))
    .pipe(change(logScripts))
    .pipe(bookmarklet({
      format: 'htmlsingle',
      file: 'bookmarks.html'
    }));
  let styling = src('src/appends/styles.html');

  let merged = merge(bookmarks, styling);

  if (APPEND_BROWSER_SYNC_TAG) {
    merged.add(src('src/appends/browser-sync.html'));
  }

  return merged
    .pipe(order(['bookmarks.html', '*.html']))
    .pipe(concat('index.html'))
    .pipe(dest('dist'));
}

function displayBookmarkletsLength(cb) {

  /**
   * Chrome appears to use a file-based solution to store bookmarks, so it might be limited by storage size
   * Firefox appears to use SQLite database to store bookmarks therefore is limited by its maximum page size
   *  - https://support.mozilla.org/en-US/questions/1259005#answer-1221738
   *    + "I think that the maximum for a bookmarklet is a few tens of bytes below 64KB
   *        (around 65500 bytes; I have one over 64000) (...) I gave it another test and can get to *65536*."
   *    + Note: 65536 bytes equals 65536 characters (1:1)
   *  - https://www.sqlite.org/limits.html
   *    + "Every database consists of one or more "pages". Within a single database, every page is the same size,
   *        but different databases can have page sizes that are powers of two between 512 and *65536*, inclusive.
   *        The maximum size of a database file is 4294967294 pages."
   */

  const scripts = [];
  const indexContent = fs.readFileSync('./dist/index.html', { encoding:'utf8', flag:'r' });
  const $ = cheerio.load(indexContent);
  const pageLinks = $('a');
  pageLinks.each(function (index, el) {
    const len = $(el).attr('href').length;

    let status = '';
    if (len > 65536) {
      status = 'error';
    } else if (len > 50000) {
      status = 'warning';
    } else {
      status = 'safe';
    }

    let scriptData = {
      'name': $(el).text(),
      'length': len,
      'status': status
    };
    scripts.push(scriptData);
  });
  console.table(scripts);
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function serve() {
  browserSync.init({
    startPath: 'index.html',
    server: {
      baseDir: './dist/'
    }
  });

  watch(['./dist/**/*'], { events: ['change'] }, reload);
}

const buildAndLog = series(build, displayBookmarkletsLength);

function listen() {
  watch(['./src/**/*'], { events: ['change'] }, build);
}

const devTasks = series(appendBrowserSyncTag, buildAndLog, parallel(serve, listen));

module.exports = {
  new: newScript,
  build: build,
  publish: series(ignoreUnfinishedScripts, build),
  dev: devTasks,
  log: displayBookmarkletsLength,
  default: devTasks,
}