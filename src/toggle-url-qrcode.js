
/**
 * refs:
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 *  - https://goqr.me/api/doc/create-qr-code/
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 *  - https://www.freecodecamp.org/news/javascript-url-encode-example-how-to-use-encodeuricomponent-and-encodeuri/
 *  - https://stackoverflow.com/a/45240562 (https://developer.mozilla.org/en-US/docs/Web/API/Response/text)
 *  - https://stackoverflow.com/a/19274609 (https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
 *  - https://github.com/nayuki/QR-Code-generator/releases/tag/v1.8.0
 *
 * limitations:
 *  - requires dialog element support
 *  - uses a embeded version of https://github.com/nayuki/QR-Code-generator/releases/tag/v1.8.0
 */

const BLOCK_NAME = "block-toggle-url-qrcode";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  // @twing-include {% include 'building_blocks/shared/scripts/qrcodegen-v1_8_0-es5.min.js' %}

  let e = document.createElement("dialog");
  e.id = BLOCK_NAME;
  e.style.borderRadius = "5px";
  e.style.padding = "10px 15px";
  e.style.textAlign = "center";

  const baseUrl = new URL(window.location.href);
  const safeUrl = baseUrl.toString();

  e.innerHTML = `
    <style>
      #${BLOCK_NAME} #svg-qrcode {
        position: relative;
        min-width: 232px;
        min-height: 232px;
        background-color: white;
        padding: 1rem;
        border-radius: 3px;
        box-shadow: 0px 0px 3px 0px #bdbdbd;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      #${BLOCK_NAME} #svg-qrcode svg,
      #${BLOCK_NAME} #svg-qrcode img {
        max-width: 100%;
        max-height: 100%;
      }
      #${BLOCK_NAME} #svg-qrcode .error-msg {
        font-style: italic;
        height: 100%;
        width: 100%;
        font-size: .75rem;
      }
    </style>

    <div id="svg-qrcode">
      <svg id="svg-qrcode-inner">
        <rect width="100%" height="100%" fill="#FFFFFF" stroke-width="0"></rect>
        <path d="" fill="#000000" stroke-width="0"></path>
      </svg>
    </div>

    <br>
  `;

  // @twing-include {% include 'building_blocks/shared/partials/close-button.js' %}

  document.body.append(e);

  try {

  // @twing-include {% include 'building_blocks/shared/partials/create-qrcodegen.js' with { svgSelector: "#svg-qrcode-inner", contentVariable: "safeUrl" } %}

  } catch (err) {
    const qrcodeWrapper = document.getElementById("svg-qrcode");
    qrcodeWrapper.innerHTML = `
      <div class="error-msg">
        <span>
          We can't create a QR Code for this page.<br>
          Learn more about why here:<br>
          <a href="https://github.com/cristianofromagio/bookmarklets" target="_blank" rel="noopener noreferrer">
            github.com/cristianofromagio/bookmarklets
          </a>
        </span>
      </div>
    `;

    console.log(err);
  }

  if (typeof e.showModal === "function") {
    e.showModal();
  } else {
    alert("Sorry, the <dialog> element is not supported by this browser.");
  }

  e.addEventListener('close', function onClose() {
    removeItself();
  });
}
