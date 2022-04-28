
/**
 * refs:
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 *  - https://goqr.me/api/doc/create-qr-code/
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 *  - https://www.freecodecamp.org/news/javascript-url-encode-example-how-to-use-encodeuricomponent-and-encodeuri/
 *  - https://stackoverflow.com/a/45240562 (https://developer.mozilla.org/en-US/docs/Web/API/Response/text)
 *  - https://stackoverflow.com/a/19274609 (https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
 *
 * limitations:
 *  - requires fetch api and dialog element support
 *  - relies on goqr.me api to create qr-code, personal use shouldn't exceed free tier (but they can block/limit your usage)
 *  - cant create qr-code from pages with a strict Content Security Policy (ie. MDN and GitHub)
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
  let e = document.createElement("dialog");
  e.id = BLOCK_NAME;
  e.style.borderRadius = "5px";
  e.style.padding = "10px 15px";
  e.style.textAlign = "center";

  // encodeURIComponent encodes '/' while encodeURI doesnt
  const safeUrl = encodeURIComponent(window.location.href);
  const baseImgSize = 100; // default 100x100 (png) 232x232 (svg)
  const baseUrlLenght = 75;
  const imgSize = (safeUrl.length > baseUrlLenght) ? baseImgSize * 1.5 : baseImgSize;

  e.innerHTML = `
    <!--
    <div style="width: 150px; height: 150px; background-color: red; border-radius: 5px"></div>
    <p>${ safeUrl }</p>

    <img
      style="padding: 10px; display: none"
      src="https://api.qrserver.com/v1/create-qr-code/?data=${ safeUrl }&amp;size=${ imgSize }x${ imgSize }" width="${ imgSize }" height="${ imgSize }"
    />
    -->

    <style>
      #${BLOCK_NAME} #svg-qrcode {
        position: relative;
        min-width: 232px;
        min-height: 232px;
      }
      #${BLOCK_NAME} #svg-qrcode svg {
        max-width: 100%;
        max-height: 100%;
        border-radius: 3px;
        box-shadow: 0px 0px 3px 0px #bdbdbd;
        background-color: white;
      }
      #${BLOCK_NAME} #svg-qrcode .error-msg {
        display: flex;
        flex-direction: column;
        font-style: italic;
        height: 232px;
        justify-content: center;
        text-align: center;
        width: 232px;
        font-size: .75rem;
      }
    </style>

    <div id="svg-qrcode"></div>

    <br>
  `;

  let close = document.createElement("button");
  close.onclick = () => { removeItself() };
  close.innerHTML = "Close";
  e.append(close);

  document.body.append(e);

  try {

    fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${ safeUrl }&format=svg&qzone=1`)
      .then((response) => response.text())
      .then((content) => {
        const qrcodeWrapper = document.getElementById("svg-qrcode");
        qrcodeWrapper.innerHTML = content;

        // was going to parse svg to query width/height then update wrapper size,
        //  but min-width/min-height solved the problem
        // const parser = new DOMParser();
        // let svgElement = parser.parseFromString(content, "image/svg+xml");
        // console.log(svgElement);
      })
      .catch((err) => {
        console.log("no fetch allowed fetch");

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
      });

  } catch (err) {
    console.log("no fetch allowed try");
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
