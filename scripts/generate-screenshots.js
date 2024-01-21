
const
  fs = require('fs'),
  { basename, resolve } = require('path'),
  { src, dest, series } = require('gulp'),
  tap = require('gulp-tap'),
  puppeteer = require('puppeteer'),
  cheerio = require('cheerio');

const { getCommonPath } = require('./utils/common-paths');
const { sourceDirectory, buildDirectory } = getCommonPath();

const stylizations = [
  "toggle-css-outline",
  "toggle-dom-depth-visualizer",
  "toggle-gfm-markdown-styling",
];

const miniapps = [
  "list-spotify-web-playlist-songs",
  "list-youtube-subscriptions",
  "page-elements-vanish",
  "toggle-focused-element", //kinda
  "youtube-timestamps",
];

const dialogs = [
  "generate-string-copy-bookmarklet",
  "github-html-preview",
  "toggle-url-qrcode",
  "wayback-search",
];

const actions = [
  "string-copy-bookmarklet",
  "wayback-save",
];

const demoableScripts = [...stylizations, ...miniapps, ...dialogs];
// const demoableScripts = [...stylizations];

const fromGlobs = async (done) => {
  const buildRelative = basename(buildDirectory);
  const scriptsGlob = demoableScripts.map((filename) => buildRelative + '/compiled/' + filename);

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 800,
      height: 600,
    });
    await page.goto("https://wikipedia.org");

    for (const script of scriptsGlob) {
      console.log(script);
      const name = basename(script);
      const contents = fs.readFileSync(script+".js", { encoding:'utf8', flag:'r' });

      // await page.goto("file:///C:/Users/froma/Development/bookmarklets/dist/index.html");
      await page.reload({
        waitUntil: 'domcontentloaded'
      });

      await page.evaluate(contents);
      await page.screenshot({ path: "screenshots/"+ name +".png" });
    }
  } catch (err) {
    console.log('Error: ', err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  done();
};

module.exports = {
  fromCompiledFiles: fromGlobs,
}