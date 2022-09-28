# Bookmarklets

This is a collection of bookmarklets I've created to help with web development and having fun.

## Usage

- `npm install`
- `gulp` or `gulp dev`
- `npx gulp` or `npx gulp dev` (to run without globally installed `gulp-cli`)

## Steps to publish

Automatically runs GitHub Action on `main` branch pushes if any `src/**.js` is included in the commit. It runs `npx gulp publish` command then publish the generated `dist` folder to `gh-pages` branch.

## What can be improved

- [ ] Document each script usage
- [ ] Start versioning scripts
- [ ] Transform scripts into both a single netscape-bookmark html file and each one into a compatible user-script (monkeyscript, tampermonkey, etc)
