
/**
 *  It was originally meant to be called "page-elements-hew" (because of axe cutting),
 *    then "page-elements-blip" (because of Thanos), but "vanish" is more intuitive
 *
 * refs:
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *  - https://stackoverflow.com/a/55537385
 *  - https://www.tutorialrepublic.com/faq/how-to-disable-spell-checking-in-html-forms.php
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event
 *  - (why we cant run a "paste button" from bookmarklet)
 *    - https://daily-dev-tips.com/posts/javascript-paste-text-from-the-clipboard/
 *  - https://stackoverflow.com/a/45831670
 *  - https://www.discoverdev.io/blog/series/js30/27-click-drag/
 *  - https://stackoverflow.com/a/5799834
 *  - https://www.polymer-project.org/blog/shadydom (specifically for YouTube interface)
 */

// @twing-include {% include 'building_blocks/shared/partials/utils.js' %}

const BLOCK_NAME = "page-elements-vanish";

const removeItself = () => {
  let e = $("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
};

const displayError = (msg) => {
  alert(msg);
};

let displayingTimeout;
const displayAlert = (message) => {
  const alert = $("#" + BLOCK_NAME + " #alert");
  alert.innerText = message;
  alert.style.display = "inline-block";
  clearTimeout(displayingTimeout);
  displayingTimeout = setTimeout(() => {
    alert.innerText = "";
    alert.style.display = "none";
  }, 3000);
}

const copyToClipboard = (content, msg = "Config copied!") => {
  const el = create('textarea');
  el.value = content;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  displayAlert(msg);
};

if ($("#" + BLOCK_NAME)) {
  removeItself();
} else {

  let e = create("details");
  e.removeItself = removeItself;
  e.id = BLOCK_NAME;
  e.setAttribute("open", "");
  e.innerHTML = `
    <style>
    	#${BLOCK_NAME} {
      	background-color: rgba(27, 32, 50, .9);
        border-radius: 5px;
        border: 3px solid #4d646f;
        color: white;
        display: block;
        font-family: sans-serif;
        font-size: 16px;
        margin: auto;
        padding: 0;
        position: fixed;
        right: 0;
        text-align: center;
        top: 0;
        width: 280px;
        z-index: 9999;
      }
      #${BLOCK_NAME} > summary {
        background-color: #607D8B;
        color: #fff;
        cursor: pointer;
        font-size: .75em;
        padding: .5em .75em;
        text-align: left;
        user-select: none;
        margin: 0;
      }
      #${BLOCK_NAME} summary {
        display: list-item; /* this is the default; 'block' removes the arrow */
      }
      /* required to overwrite default website font-family */
      #${BLOCK_NAME} * {
        font-family: sans-serif;
        box-sizing: border-box;
      }
      #${BLOCK_NAME} button,
      #${BLOCK_NAME} .btn {
        background-clip: padding-box;
        background-color: #607D8B;
        border-radius: 3px;
        border: none;
        box-shadow: inset 0 -4px rgba(0,0,0,0.2);
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-size: .75em;
        font-weight: 600;
        line-height: 30px;
        margin: .25em;
        overflow: hidden;
        padding: 0 1.5em;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        vertical-align: middle;
        white-space: nowrap;
      }
      #${BLOCK_NAME} input,
      #${BLOCK_NAME} textarea {
        color: #262626;
        font-size: 16px;
        line-height: 20px;
        min-height: 28px;
        border-radius: 4px;
        padding: 8px;
        border: 2px solid transparent;
        box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
        background: rgb(251, 251, 251);
        transition: all 0.1s ease 0s;
        margin: 0;
        box-sizing: border-box;
        width: 100%;
        font-family: monospace;
        font-weight: bold;
      }
      #${BLOCK_NAME} input:focus {
        border: 2px solid #607D8B;
      }
      #${BLOCK_NAME} #alert {
        position: absolute;
        bottom: -.75rem;
        left: 50%;
        transform: translateX(-50%);
        padding: .25rem .75rem;
        background-color: #222;
        color: #fff;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        display: none;
        font-size: 12px;
      }
      #${BLOCK_NAME} p {
        margin: 4px 0 2px;
        text-align: left;
      }
      #${BLOCK_NAME} hr {
        padding: 0;
        margin: 8px 0;
        border: revert;
      }
      #${BLOCK_NAME}-action-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }


      #${BLOCK_NAME} .d-full {
        display: block;
        margin: 4px auto;
        width: 100%;
      }
      #${BLOCK_NAME} .mb-1 {
        margin-bottom: .5rem;
      }
    </style>

    <summary>${BLOCK_NAME}</summary>

    <span id="alert"></span>

    <div style="padding: 8px">
      <p>Selector for vanishing elements:</p>
      <input spellcheck="false" class="${BLOCK_NAME}-config-sync mb-1" data-config-name="elementsSelector" id="vanishingElementsSelector"/>

      <p>Nested selector for comparing text:</p>
      <input spellcheck="false" class="${BLOCK_NAME}-config-sync mb-1" data-config-name="textSelector" id="nestedComparingTextSelector"/>

      <p>Nested selector attribute:</p>
      <input
        spellcheck="false"
        class="${BLOCK_NAME}-config-sync mb-1"
        placeholde="defaults to 'textContent'"
        value="textContent"
        data-config-name="textSelectorAttr"
        id="nestedComparingTextSelectorAttr"/>

      <p>Comparing value (to keep):</p>
      <input spellcheck="false" class="${BLOCK_NAME}-config-sync mb-1" data-config-name="compare" id="comparingValue"/>

      <hr>
      <details id="${BLOCK_NAME}-config-toggle" style="text-align:left;margin:0 0 4px 0;padding:2px;border:1px solid rgba(255,255,255,.2);border-radius:3px">
        <summary style="height:35px;line-height:35px;margin:4px 0;padding:0;user-select:none;cursor:pointer">
          Quick config
          <button id="focusConfigButtonTrigger" style="float:right">focus</button>
        </summary>
        <textarea spellcheck="false" rows="4" id="${BLOCK_NAME}-config"></textarea>
        <button class="d-full" id="${BLOCK_NAME}-config-copy">copy</button>
      </details>

      <hr class="mb-1">

      <div id="${BLOCK_NAME}-action-buttons">
        <button id="vanishButtonTrigger">Vanish</button>
        <button id="purgeButtonTrigger">Purge</button>
        <button id="undoButtonTrigger">Undo</button>

        <a
          id="copyToggleBookmarkletTrigger"
          href=""
          class="btn"
          style="flex-basis: 100%; display:none">Copy bookmarklet</a>

        <button
          onclick="getElementById('${BLOCK_NAME}').removeItself()"
          style="flex-basis: 100%">Close</button>
      </div>

    </div>
  `;

  document.body.append(e);

  if (!$(`#${BLOCK_NAME}-stylesheet`)) {
    let vanishStylesheet = create("style");
    vanishStylesheet.id = `${BLOCK_NAME}-stylesheet`;
    vanishStylesheet.innerHTML = `
      .${BLOCK_NAME}-vanished-element {
        visibility: hidden;
        opacity: 0;
        height: 0;
      }
      .${BLOCK_NAME}-vanished-element--purged {
        display: none !important;
      }
    `;
    document.head.append(vanishStylesheet);
  }

  const config = new Map([
    ["elementsSelector", ""],
    ["textSelector", ""],
    ["textSelectorAttr", ""],
    ["compare", ""]
  ]);

  e.querySelector("#vanishButtonTrigger").addEventListener('click', () => {

    // SCRIPT CORE SETUP
    // cant 'multi-declare' then in one line because minifier goes crazy
    let selector = '';
    let comparingTextBlock = '';
    let comparingTextBlockAttr = '';
    let comparingValue = '';
    let parsedConfigs = '';

    const configInput = $(`#${BLOCK_NAME}-config`, e).value;

    if (configInput) {
      try {
        const configContent = Object.entries(JSON.parse(configInput));
        parsedConfigs = new Map(configContent);
      } catch (err) {
        console.log('ERROR: couldnt parse configs');
        console.log(err);
        return;
      }

      selector = parsedConfigs.get("elementsSelector") || $("#vanishingElementsSelector", e).value.trim();
      comparingTextBlock = parsedConfigs.get("textSelector") || $("#nestedComparingTextSelector", e).value.trim();
      comparingTextBlockAttr = parsedConfigs.get("textSelectorAttr") || $("#nestedComparingTextSelectorAttr", e).value.trim();
      comparingValue = parsedConfigs.get("compare") || $("#comparingValue", e).value.trim();
    } else {
      console.log('INFO: no configs');

      selector = $("#vanishingElementsSelector", e).value.trim();
      comparingTextBlock = $("#nestedComparingTextSelector", e).value.trim();
      comparingTextBlockAttr = $("#nestedComparingTextSelectorAttr", e).value.trim();
      comparingValue = $("#comparingValue", e).value.trim();

      fillConfig(e);
    }

    if (!selector || !comparingTextBlock || !comparingTextBlockAttr || !comparingValue) {
      console.log('INFO: required values not provided');
      return;
    }
    // SCRIPT CORE SETUP - END

    updateCopyBookmarklet();

    // SCRIPT CORE RUN
    try {

      const selectorAll = document.querySelectorAll(selector);

      if (selector.length === 0) {
        console.log('INFO: no blocks found with selector');
        return;
      }

      let comparingValueText = comparingValue.toLowerCase();
      const isNegation = (comparingValueText[0] === "~") ? true : false;

      selectorAll.forEach((el) => {
        // window.Polymer tries to query for Polymer-based webcomponents (specifically target YouTube interface)
        let comparingElementBlock = el.querySelector(comparingTextBlock) || window.Polymer.dom(el).shadowRoot.querySelector(comparingTextBlock);
        if (!comparingElementBlock) {
          console.log("Can't find any `comparingTextBlock` blocks inside the elementSelector");
          return;
        }

        const comparingContent = comparingElementBlock[comparingTextBlockAttr];
        if (!comparingContent) {
          console.log("Can't find any `comparingTextBlockAttr` attributes on the comparingElementBlock");
          return;
        }
        const comparingContentLower = comparingContent.trim().toLowerCase();

        if (isNegation) {
          // removes ~ symbol
          let comparingValueTextWithoutNegation = comparingValueText.substring(1);
          if (comparingContentLower.includes(comparingValueTextWithoutNegation)) {
            el.classList.add(`${BLOCK_NAME}-vanished-element`);
          }
        } else {
          if (!comparingContentLower.includes(comparingValueText)) {
            el.classList.add(`${BLOCK_NAME}-vanished-element`);
          }
        }
      });
    } catch(err) {
      console.log('ERROR: couldnt execute vanisher');
      console.log(err);
    }

    // SCRIPT CORE RUN - END

  });

  e.querySelector("#undoButtonTrigger").addEventListener('click', () => {
    document.querySelectorAll(`.${BLOCK_NAME}-vanished-element`).forEach((el) => {
      el.classList.remove(`${BLOCK_NAME}-vanished-element--purged`);
      el.classList.remove(`${BLOCK_NAME}-vanished-element`);
    });
  });

  e.querySelector("#purgeButtonTrigger").addEventListener('click', () => {
    let vanishClass = `${BLOCK_NAME}-vanished-element`;
    let vanishedEls = document.querySelectorAll('.'+vanishClass);
    if (vanishedEls && vanishedEls.length > 0) {
      vanishedEls.forEach((el) => {
        if(!el.classList.contains(`${vanishClass}--purged`)) {
          el.classList.add(`${vanishClass}--purged`);
        }
      });
    } else {
      alert(`[${BLOCK_NAME}]: Vanish first then purge`);
    }
  });

  e.querySelectorAll(`.${BLOCK_NAME}-config-sync`).forEach((el) => {
    el.addEventListener('input', (ev) => {
      config.set(ev.target.dataset['configName'], ev.target.value);
      e.querySelector(`#${BLOCK_NAME}-config`).value = '';
    });
  });

  e.querySelector(`#${BLOCK_NAME}-config`).addEventListener('paste', (ev) => {
    let clipboardData, pastedData;
    clipboardData = ev.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    fillFields(e, pastedData);
  });

  e.querySelector("#focusConfigButtonTrigger").addEventListener('click', () => {
    const detailsEl = e.querySelector(`#${BLOCK_NAME}-config-toggle`);
    if (!detailsEl.open) {
      detailsEl.toggleAttribute('open');
    }

    e.querySelector(`#${BLOCK_NAME}-config`).focus();
  });

  e.querySelector(`#${BLOCK_NAME}-config-copy`).addEventListener('click', () => {
    copyToClipboard(e.querySelector(`#${BLOCK_NAME}-config`).value);
  });

  e.querySelector("#copyToggleBookmarkletTrigger").addEventListener('click', (ev) => {
    ev.preventDefault();
    copyToClipboard(getHeadlessBookmarklet(), 'Bookmarklet copied!');
  });

  function getHeadlessBookmarklet() {
    const config = e.querySelector(`#${BLOCK_NAME}-config`).value;
    const headlessBookmarklet = `
      /* @twing-start{% set vars = { hash: '${Date.now()}', configInput: '${config}', canonicalBlockName: '${BLOCK_NAME}' } %}@twing-end */
      // @twing-include {% include 'building_blocks/shared/partials/headless-toggle-page-elements-vanish.js' with vars %}
    `;
    // removes leading spaces (identation) + removes newlines
    return headlessBookmarklet.replace(/^ +/gm, '').replace(/[\n\r]+/g, '');
  }

  function fillConfig(el) {
    let selector = $("#vanishingElementsSelector", el).value.trim();
    let comparingTextBlock = $("#nestedComparingTextSelector", el).value.trim();
    let comparingTextBlockAttr = $("#nestedComparingTextSelectorAttr", el).value.trim();
    let comparingValue = $("#comparingValue", el).value.trim();

    config.set("elementsSelector", selector);
    config.set("textSelector", comparingTextBlock);
    config.set("textSelectorAttr", comparingTextBlockAttr);
    config.set("compare", comparingValue);
    el.querySelector(`#${BLOCK_NAME}-config`).value = JSON.stringify(Object.fromEntries(config));
  }

  function fillFields(el, configContent) {
    try {
      const pastedConfigContent = Object.entries(JSON.parse(configContent));
      const pastedConfig = new Map(pastedConfigContent);

      el.querySelector("#vanishingElementsSelector").value = pastedConfig.get("elementsSelector");
      el.querySelector("#nestedComparingTextSelector").value = pastedConfig.get("textSelector");
      if (pastedConfig.get("textSelectorAttr"))
        el.querySelector("#nestedComparingTextSelectorAttr").value = pastedConfig.get("textSelectorAttr");
      el.querySelector("#comparingValue").value = pastedConfig.get("compare");
    } catch (err) {
      console.log('ERROR: couldnt parse configs on paste');
      console.log(err);
    }
  }

  function updateCopyBookmarklet(el) {
    const triggerEl = $("#copyToggleBookmarkletTrigger", el);
    fill(triggerEl, 'href', getHeadlessBookmarklet());
    fill(triggerEl, 'title', 'Click to COPY, drag to bookmarks tab to SAVE');
    fill(triggerEl, 'style.display', 'inline-block');
    fill(triggerEl, 'textContent', 'toggleabble-purge-bookmarklet');
  }

  // @twing-include {% include 'building_blocks/shared/partials/move-handler.js' %}

}
