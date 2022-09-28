/**
 * refs:
 * 	- https://htmlpreview.github.io/?
 *
 * limitations:
 *  - requires dialog element support
 */

const BLOCK_NAME = "github-html-preview";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {
  let previewLink = '';

  // TODO: limit to run only on github domain and .html files
  // const filenamesWhitelist = ['.html', '.htm'];
  // if (filenamesWhitelist.includes(location.protocol))
  previewLink = document.location.href;

  let e = document.createElement("dialog");
  e.id = BLOCK_NAME;
  e.removeItself = removeItself;

  e.innerHTML = `
    <style>
      #${BLOCK_NAME} {
        font-size: 16px;
        border-radius: 5px;
        border: 3px solid #4d646f;
        position: relative;
        padding: 0;
        margin: auto;
        font-family: sans-serif;
        text-align: center;
      }
      #${BLOCK_NAME}:before {
        display: block;
        padding: .5em .75em;
        background-color: #607D8B;
        text-align: left;
        color: #fff;
        content: "${BLOCK_NAME}";
        font-size: .75em;
      }

      /* required to overwrite default website font-family */
      #${BLOCK_NAME} * {
        font-family: sans-serif;
        box-sizing: border-box;
      }

      #${BLOCK_NAME} button {
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

      #${BLOCK_NAME} input {
        color: #262626;
        font-size: 16px;
        line-height: 20px;
        min-height: 28px;
        border-radius: 4px;
        padding: 8px 16px;
        border: 2px solid transparent;
        box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
        background: rgb(251, 251, 251);
        transition: all 0.1s ease 0s;
      }

      #${BLOCK_NAME} input:focus {
        border: 2px solid #607D8B;
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

      #${BLOCK_NAME} #preview-link {
        min-width: 250px;
        max-width: 600px;
        width: ${previewLink.length}ch;
        display: block;
        margin-bottom: .5em;
      }

      #${BLOCK_NAME} button[type=submit] span::after {
        content: "";
        background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white"><g><path d="M11 2H7V0h7v7h-2V3L7 8 6 7l5-5z"/><path d="M6 2H0v12h12V8h-2v4H2V4h4V2z"/></g></svg>');
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 5px;
        padding: 0;
        width: 11px;
        height: 11px;
      }
    </style>

    <span
      class="close-bookmarklet"
      onclick="getElementById('${BLOCK_NAME}').removeItself()">
      close
    </span>

    <div style="padding: 16px">
      <form id="search-form" style="margin:0;padding:0">
        <input type="text" id="preview-link" value="${previewLink}"/>
        <button type="submit">
          <span>preview html file</span>
        </button>
      </form>
    </div>
  `;

  document.body.append(e);

  e.querySelector("#search-form").addEventListener('submit', function (ev) {
    ev.preventDefault();
    // get input field value with provided url
    const searchUrl = ev.target[0].value;

    // window.open relies on user browser settings,
    //  but should work most of the times to open a link in a new tab
    window.open('https://htmlpreview.github.io/?' + searchUrl.replace(/\/$/, ''), '_blank', 'noopener,noreferrer');
    removeItself();
  });

  if (typeof e.showModal === "function") {
    e.showModal();
  } else {
    alert("Sorry, the <dialog> element is not supported by this browser.");
  }

  e.addEventListener('close', function onClose() {
    removeItself();
  });

}
