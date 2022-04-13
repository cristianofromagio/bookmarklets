# Bookmarklets

This is a collection of bookmarklets I've used for web development.

## Usage

- `npm install`
- `gulp` or `gulp dev`
- `npx gulp` or `npx gulp dev` (to run without globally installed `gulp-cli`)

## Steps to publish

- Commit on `main`
- `git checkout gh-pages`
- `git merge main`
- `npx gulp publish`
	+ create `index.html` with all scripts from `/src/` then move it to `/docs/`
- Commit changes on `gh-pages`
- `git push origin gh-pages`
	+ new online version will soon be updated, after `gh-actions` runs
