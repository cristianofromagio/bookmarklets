
/**
 * refs:
 *  - https://github.com/wanasit/chrono
 *  - https://github.com/cristianofromagio/chrono - fork with Rollup config and trimmed parsers/locales
 *  - https://stackoverflow.com/a/26952157 - `browserify -s moduleName --bare moduleName.js -o filename.js`
 *  - https://github.com/browserify/browserify
 *  - https://github.com/browserify/common-shakeify - only works for like `require(packageName)`
 *  - https://github.com/TypeStrong/tsify
 *  - https://github.com/srod/node-minify
 *  -
 *  - https://rollupjs.org/introduction/
 *  - https://rollupjs.org/command-line-interface/
 *  - https://rollupjs.org/configuration-options/
 *  - https://github.com/rollup/plugins/tree/master/packages/typescript
 *  - https://github.com/rollup/plugins/tree/master/packages/node-resolve
 *  - https://github.com/rollup/plugins/tree/master/packages/commonjs
 *  - https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency
 *  - https://rollupjs.org/troubleshooting/#error-this-is-undefined
 *  -
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
 *  - https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch02s06.html
 *  - https://ctd.ifsp.edu.br/images/Logos_biblioteca/NBR_5892_Datas_e_horas.pdf
 *  - https://devhints.io/wip/intl-datetime
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 *  - https://dateful.com/time-zone-converter
 *  -
 *  - https://github.com/wanasit/chrono/blob/master/src/timezone.ts
 *  - chrono-node
 *      > browserify src/index.ts -p tsify -s Chrono > browserify-chrono-tzmap.js
 *      > node-minify --compressor uglify-js --input 'browserify-chrono-tzmap.js' --output 'browserify-chrono-tzmap.min.js'
 *      > using variable on git bash:
 *        > SCRIPTNAME="browserify-chrono"; browserify src/index.ts -p tsify -s Chrono > $SCRIPTNAME".js" && node-minify --compressor uglify-js --input $SCRIPTNAME".js" --output $SCRIPTNAME".min.js"
 *        > SCRIPTNAME="output/rollup-chrono"; rollup --config --file $SCRIPTNAME".js" && node-minify --compressor uglify-js --input $SCRIPTNAME".js" --output $SCRIPTNAME".min.js"
 *          > compiles a modified version of chrono-node using the rollup.config.mjs config file in the root
 * 	- https://github.com/cristianofromagio/chrono
 * 	    > clone the repo, run `npx rollup --config`
 *        > it automatically creates `dist/chrono-bundle.js` and `dist/chrono-bundle.min.js`
 * 	-
 * 	- https://jsfiddle.net/7dfsnp23/ - w3c test harness example
 * 	- https://github.com/yantra-core/Sutra.js
 * 	- https://github.com/yantra-core/Sutra.js/blob/master/benchmark/sutra-benchmark-test.js
 * 	- https://github.com/yantra-core/Sutra.js/tree/master/test
 * 	-
 * 	-
 * limitations:
 *  - dialog element
 *  - bookmarklet string length
 *  - need compiled version of chrono-node lib with rollup (and this make us hit the lenght limit in Firefox)
 *  - KNOWN BUG: when adding a larger-than-capacity bookmarklet in Firefox, it will fail and not add it to toolbar,
 *      but then we also can't add new other (valid) bookmarklets to the toolbar, requiring a browser restart to fix
 *  -
 */

const BLOCK_NAME = "dialog-datetime-conversor";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  if (e) e.parentNode.removeChild(e);
  e = null;
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  // @twing-include {% include 'building_blocks/shared/scripts/chrono-bundle.min.js' %}

  // @twing-include {% include 'building_blocks/shared/partials/get-selected-text.js' %}

  let selectedText = getSelectedText();

  if (!selectedText) {
    alert("No text selected");
    throw "exit";
  }

  let displayTxt;
  let displayOpts = {dateStyle: 'long', timeStyle: 'full'};

  let rgx = new RegExp("\\b('" + Object.keys(Chrono.tzmap).join('|') + "')\\b", "gm");
  let foundTzs = selectedText.match(rgx);

  if (foundTzs && foundTzs.length > 0) {
    displayTxt = Chrono.parseDate(selectedText, {
      timezone: foundTzs[0]
    });
  } else {
    displayTxt = Chrono.parseDate(selectedText);
  }

  let e = document.createElement("dialog");
  e.id = BLOCK_NAME;
  e.removeItself = removeItself;

  e.innerHTML = `<style>
#${BLOCK_NAME} {
  font-size: 16px;
  border-radius: 5px;
  border: 3px solid #4d646f;
  position: fixed;
  padding: 0;
  margin: auto;
  font-family: sans-serif;
  text-align: center;
}

/* required to overwrite default website font-family */
#${BLOCK_NAME} * {
  font-family: sans-serif;
  box-sizing: border-box;
}

#${BLOCK_NAME} .close-bookmarklet {
  position: absolute;
  top: .25em;
  right: .25em;
  padding: .25em .75em;
  cursor: pointer;
  color: #fff;
  font-weight: bolder;
  font-size: .75em;
  background-color: rgba(0,0,0,.1);
  border-radius: 3px;
}
</style>

<span class="close-bookmarklet" id="close" aria-label="close" formnovalidate>close</span>

<div style="padding: 16px">
  <b>original: </b>${selectedText}<br>
  <b>parsed: </b>${displayTxt}<br>
  <b>locale: </b>${new Date(displayTxt).toLocaleString()}<br>
  <b>locale long: </b>${new Date(displayTxt).toLocaleString(undefined, displayOpts)}<br>
</div>`;

  document.body.append(e);

  if (typeof e.showModal === "function") {
    e.showModal();
  } else {
    alert("Sorry, the <dialog> element is not supported by this browser.");
  }

  e.addEventListener('close', function onClose() {
    removeItself();
  });

  e.querySelector('#close').addEventListener('click', () => {
    removeItself();
  });

}
