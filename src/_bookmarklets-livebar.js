
// since this is prefixed with `_`, it will not be compiled into the live version
// see `./bookmarklets-livebar.js` file for live version

// this strangely does not have the bug where we can't use `` (backticks) in the template
//  like stated in the README 'Known issues', maybe because it is a whole-file template?

/* @twing-start{% set vars = { sourceUrl: 'http://localhost:3000/index.html', sourceEnv: 'local' } %}@twing-end */
// @twing-include {% include 'building_blocks/shared/templates/bookmarklets-livebar.js.twig' with vars %}
