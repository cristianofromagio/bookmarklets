# Bookmarklets

This is a collection of bookmarklets I've created to help with web development and having fun.

## Usage

- `npm install`
- `gulp` or `gulp dev`
- `npx gulp` or `npx gulp dev` (to run without globally installed `gulp-cli`)
  + `npx gulp dev --logs script-file-name` will `console.log` script file contents right before compiling it into the final `html` file.
  + `npx gulp dev --logs script-file-name1,script-file-name2`

## Steps to publish

Automatically runs GitHub Action on `main` branch pushes if any `src/**.js` is included in the commit. It runs `npx gulp publish` command then publish the generated `dist` folder to `gh-pages` branch.

## What can be improved

- [ ] Document each script usage
  - [ ] Add metadata block to each script
  - [ ] Auto generate documentation based on metadata from script files
- [ ] Create single userscript including all bookmarklets as menu-action
- [ ] Create formatted Devtools Snippets import-file

## Known issues

- Can't use backticks \`\` on shared building blocks to be included by twig
- Can't declare multiple variables in one line because minifier will not be able to parse the variables name correctly to obfuscate
- Can't place comments at end-of-line on bookmarklets snippets because `strip-comments` will not be able to remove then and will cause 'script ended too soon'.