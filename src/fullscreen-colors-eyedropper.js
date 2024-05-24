
/**
 * refs:
 *  - https://shoelace.style/components/color-picker
 *  - https://shoelace.style/getting-started/usage
 *  - https://lit.dev/docs/components/lifecycle/
 *  - https://github.com/shoelace-style/rollup-example
 *  - https://wesbos.com/javascript/04-the-dom/traversing-and-removing-nodes
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
 *  - https://developer.chrome.com/docs/capabilities/web-apis/eyedropper
 *  - https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
 *  - https://github.com/iam-medvedev/eyedropper-polyfill
 *  -
 * limitations:
 *  - EyeDropper is only available on HTTPS
 *  - Could not reduce shoelace-colorpicker that much to fit into our bookmarklet limits (works on chromium tho)
 *  - EyeDropper cannot be "sequentially" called, it must be trigged by an user action
 *    - The workaround is to click the EyeDropper button, select a color, and because the EyeDropper button still
 *      retains the focus, press "spacebar" to trigger the EyeDropper selection again
 *  -
 */

// @twing-include {% include 'building_blocks/shared/partials/utils.js' %}

const BLOCK_NAME = "fullscreen-colors-eyedropper";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
  window.blockFn[BLOCK_NAME] = null;
  delete window.blockFn[BLOCK_NAME];
};

const displayError = (msg) => {
  alert(msg);
};

let displayingTimeout;
const displayAlert = (message) => {
  const alert = document.querySelector("#" + BLOCK_NAME + " #alert");
  alert.innerText = message;
  alert.style.display = "inline-block";
  clearTimeout(displayingTimeout);
  displayingTimeout = setTimeout(() => {
    alert.innerText = "";
    alert.style.display = "none";
  }, 3000);
}

if (document.querySelector("#" + BLOCK_NAME)) {
  blockFn[BLOCK_NAME].removeItself();
} else {

  // @twing-include {% include 'building_blocks/shared/scripts/shoelace-colorpicker.min.js' %}

  if (!window.blockFn) {
    window.blockFn = {};
  }
  window.blockFn[BLOCK_NAME] = {};
  window.blockFn[BLOCK_NAME].removeItself = removeItself;

  let e = document.createElement("details");
  e.id = BLOCK_NAME;
  e.setAttribute("open", "");

  e.innerHTML = `
    <style>

      // @twing-include {% include 'building_blocks/shared/styles/shoelace-colorpicker.css' %}

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
        width: 320px;
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
        display: list-item;
      }
      /* required to overwrite default website font-family */
      #${BLOCK_NAME} * {
        font-family: sans-serif;
        box-sizing: border-box;
      }
      #${BLOCK_NAME} button,
      #${BLOCK_NAME} .button {
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
        user-select: none;
      }
      #${BLOCK_NAME} input,
      #${BLOCK_NAME} textarea {
        color: #262626;
        font-size: 16px;
        line-height: 20px;
        border-radius: 4px;
        padding: 8px;
        border: 2px solid transparent;
        background: rgb(251, 251, 251);
        transition: all 0.1s ease 0s;
        margin: 0;
        box-sizing: border-box;
        font-family: monospace;
        font-weight: bold;
      }
      #${BLOCK_NAME} select {
        cursor: pointer;
        font-size: 16px;
        margin: 8px .25em 0;
        padding: 8px 6px;
        outline: 2px solid #607D8B;
        box-sizing: border-box;
        border-radius: 3px;
        color: #262626;
        -webkit-appearance: none;
        box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
        background: #FBFBFB url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" height="63" width="117" fill="black"><path d="M115 2c-1-2-4-2-5 0L59 53 7 2a4 4 0 00-5 5l54 54 2 2 3-2 54-54c2-1 2-4 0-5z"/></svg>') calc(100% - 12px) 50%/12px no-repeat;
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
      #${BLOCK_NAME} .d-none {
        display: none;
      }
      #${BLOCK_NAME} .d-inline {
        display: inline-block;
      }
      #${BLOCK_NAME} .d-flex {
        display: flex;
      }
      #${BLOCK_NAME} .flex-1 {
        flex: 1;
      }
      #${BLOCK_NAME} .ai-c {
        align-items: center;
      }
      #${BLOCK_NAME} .jc-c {
        justify-content: center;
      }
      #${BLOCK_NAME} .mr-1 {
        margin-right: 1rem;
      }
      #${BLOCK_NAME}-action-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      #${BLOCK_NAME}-action-buttons button {
        flex: 1;
      }
      #${BLOCK_NAME} #redirPalette::after {
        content: "";
        background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white"><g><path d="M11 2H7V0h7v7h-2V3L7 8 6 7l5-5z"/><path d="M6 2H0v12h12V8h-2v4H2V4h4V2z"/></g></svg>');
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 5px;
        padding: 0;
        width: 11px;
        height: 11px;
      }
      #${BLOCK_NAME} sl-color-picker {
        --grid-width: 100%;
        display: flex;
      }
      #${BLOCK_NAME} sl-color-picker::part(eye-dropper-button__label) {
        font-size: 18px;
        display: flex;
        align-items: center;
      }
      #${BLOCK_NAME} sl-color-picker::part(swatches) {
        grid-gap: 0.25rem;
      }
      #${BLOCK_NAME} .color-picker__swatches {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-gap: 0.25rem;
        justify-items: center;
        border: solid 1px hsl(240 4.6% 22%);
        border-radius: .25rem;
        background-color: hsl(240 5.1% 15%);
        padding: 12px;
        forced-color-adjust: none;
      }
      #${BLOCK_NAME} .color-picker__transparent-bg {
        background-image:
          linear-gradient(45deg, hsl(240 5% 27.6%); 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, hsl(240 5% 27.6%); 75%),
          linear-gradient(45deg, transparent 75%, hsl(240 5% 27.6%); 75%),
          linear-gradient(45deg, hsl(240 5% 27.6%); 25%, transparent 25%);
        background-size: 10px 10px;
        background-position: 0 0, 0 0, -5px -5px, 5px 5px;
      }
      #${BLOCK_NAME} .color-picker__swatch {
        position: relative;
        width: 25px;
        height: 25px;
        border-radius: 0.1875rem;
      }
      #${BLOCK_NAME} .color-picker__swatch .color-picker__swatch-color {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: solid 1px rgba(0, 0, 0, 0.125);
        border-radius: inherit;
        cursor: pointer;
      }

    </style>

    <summary>${BLOCK_NAME} <span id="moveHandler" class="move-handler">move</span></summary>

    <span id="alert"></span>

    <div style="padding: 8px">

      <sl-color-picker
        class="sl-theme-dark"
        id="color-picker"
        label="Select a color"
        inline>
      </sl-color-picker>

      <div id="${BLOCK_NAME}-swatches" class="color-picker__swatches"></div>

      <div id="${BLOCK_NAME}-action-buttons">
        <label class="button d-flex flex-1 ai-c jc-c" for="autoSelectOnChange">
          <input type="checkbox" id="autoSelectOnChange" class="mr-1" checked>
          Autoselect
        </label>
        <label class="button d-flex flex-1 ai-c jc-c" for="clickToRemove">
          <input type="checkbox" id="clickToRemove" class="mr-1" checked>
          Removable
        </label>
      </div>

      <div id="${BLOCK_NAME}-action-buttons">
        <button id="selectColor">Select</button>
        <a href="#"
          class="button d-none"
          id="redirPalette"
          target="_blank"
          rel="noopener noreferrer">
          View palette
        </a>
      </div>

      <hr class="mb-1">

      <div id="${BLOCK_NAME}-action-buttons">
        <button id="resetColors">Reset</button>
        <button onclick="blockFn['${BLOCK_NAME}'].removeItself()">Close</button>
      </div>
    </div>
  `;

  document.body.append(e);

  let swatchColors = [];
  const createSwatch = (color) => {
    let swatch = create('div');
    let swatchColor = `<div class="color-picker__swatch-color" style="background-color: ${color};"></div>`;
    fill(swatch,
      ['ariaLabel', 'className', 'innerHTML', 'onclick'],
      [color, 'color-picker__swatch color-picker__transparent-bg', swatchColor, swatchClickListener]
    );
    return swatch;
  }

  const colorPicker = $('#color-picker', e);
  const isSwatchTransparent = () => swatchColors.length == 0;
  const transparentSwatch = () => { swatchColors = []; fill($(`#${BLOCK_NAME}-swatches`, e), 'innerHTML', '');};

  const swatchClickListener = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    if (isSwatchTransparent()) {
      return;
    }
    let targetSwatch = ev.target;
    if (
      targetSwatch.classList.contains("color-picker__swatch-color") ||
      targetSwatch.parentNode.classList.contains("color-picker__swatch")
    ) {
      const isRemovable = $('#clickToRemove', e);
      if (isRemovable.checked) {
        if (swatchColors.length > 1) {
          swatchColors.splice(swatchColors.indexOf(targetSwatch.parentNode.ariaLabel), 1);
          fill($('#redirPalette', e), 'href', fullscreenPaletteUrl());
        } else {
          transparentSwatch();
        }
        targetSwatch.parentElement.remove();
      } else {
        colorPicker.value = targetSwatch.parentNode.ariaLabel;
      }
    }
  }

  colorPicker.addEventListener('sl-change', (ev) => {
    console.log(colorPicker.value);
    const selectOnChange = $('#autoSelectOnChange', e);
    if (selectOnChange.checked) {
      selectColorToSwatch();
    }
  });

  $('#selectColor', e).addEventListener('click', () => {
    selectColorToSwatch();
  });

  const selectColorToSwatch = () => {
    if(colorPicker.value) {
      if (isSwatchTransparent()) {
        swatchColors = [colorPicker.value];
      } else {
        swatchColors = [...swatchColors, colorPicker.value];
      }

      let swatchEl = createSwatch(colorPicker.value);
      let swatches = $(`#${BLOCK_NAME}-swatches`, e);
      swatches.append(swatchEl);

      enableRedirBtn();
    } else {
      disableRedirBtn();
    }
  }

  const enableRedirBtn = () => {
    let b = $('#redirPalette', e);
    b.classList.replace("d-none", "d-inline");
    b.href = fullscreenPaletteUrl();
  }

  const disableRedirBtn = () => {
    let b = $('#redirPalette', e);
    b.classList.replace("d-inline", "d-none");
    b.href = '#';
  }

  const fullscreenPaletteUrl = () => {
    let url = 'https://fullscreen.page/palette/';
    url += swatchColors.join("-").replaceAll("#", "");

    return encodeURI(url);
  }

  $('#resetColors', e).addEventListener('click', () => {
    transparentSwatch();
    disableRedirBtn();
  });


  // @twing-include {% include 'building_blocks/shared/partials/move-handler.js' %}

}
