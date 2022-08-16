
/**
 * refs:
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */

const BLOCK_NAME = "generate-string-copy-bookmarklet";

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
  e.style.fontSize = "16px";
  e.style.borderRadius = "5px";
  e.style.border = "3px solid #4d646f";
  e.style.padding = "0"; // required to simplify :before "header" alignment
  e.style.textAlign = "center";
  e.style.position = "relative"; // required for close "button" positioning
  e.style.margin = "auto"; // required to bypass wildcard css reset overwrite (i.e. * {margin: 0})
  e.style.fontFamily = "sans-serif"; // required to overwrite default website font-family

  e.innerHTML = `
      <style>
        #${BLOCK_NAME}:before {
          display: block;
          padding: .25em .75em;
          background-color: #607D8B;
          text-align: left;
          color: #fff;
          content: "${BLOCK_NAME}";
          font-size: .75em;
        }

        /* required to overwrite default website font-family */
        #${BLOCK_NAME} * {
          font-family: sans-serif;
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
          top: 0;
          right: 0;
          padding: .125em .25em;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
        }

        #${BLOCK_NAME} input {
          min-width: 250px;
          max-width: 600px;
          display: block;
          margin-bottom: .5em;
        }
      </style>

      <div style="padding:1rem">
        <form id="bookmarkletForm" style="margin:0;padding:0">
          <p>Bookmarklet template code:</p>
          <input type="text" id="bookmarkletTemplate"/>
          <p>Bookmarklet template placeholder:</p>
          <input type="text" id="bookmarkletPlaceholder"/>
          <p>Bookmarklet name:</p>
          <input type="text" id="bookmarkletName"/>
          <p>Bookmarklet copy string content:</p>
          <input type="text" id="bookmarkletString"/>
          <button type="submit">create</button>

          <div id="bookmarkletResult"></div>
        </form>
      </div>
    `;

  let close = document.createElement("span");
  close.className = "close-bookmarklet";
  close.onclick = () => { removeItself() };
  close.innerHTML = "close";
  e.append(close);

  document.body.append(e);

  function addSlashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }

  e.querySelector("#bookmarkletForm").addEventListener('submit', (ev) => {
    ev.preventDefault();
    e.querySelector("#bookmarkletResult").innerHTML = '';

    const templateValue = e.querySelector("#bookmarkletTemplate").value.trim();
    const placeholderValue = e.querySelector("#bookmarkletPlaceholder").value.trim();
    const nameValue = e.querySelector("#bookmarkletName").value.trim();
    const stringValue = e.querySelector("#bookmarkletString").value.trim();

    const stringCopyContent = templateValue.replace(placeholderValue, addSlashes(stringValue));

    const link = document.createElement('a');
    link.innerText = nameValue;
    link.href = stringCopyContent;
    e.querySelector("#bookmarkletResult").appendChild(link);
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