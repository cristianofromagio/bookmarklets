
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

  let searchLink = '';

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
          width: ${searchLink.length}ch;
          display: block;
          margin-bottom: .5em;
        }
      </style>

      <div style="padding:1rem">
        <form id="bookmarkletForm" style="margin:0;padding:0">
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

  const stringCopyBookmarklet = `javascript:(function()%7B%22use%20strict%22%3Bvar%20copyToClipboard%3Dfunction(e)%7Bvar%20o%3Ddocument.createElement(%22textarea%22)%3Bo.value%3De%2Co.setAttribute(%22readonly%22%2C%22%22)%2Co.style.position%3D%22absolute%22%2Co.style.left%3D%22-9999px%22%2Cdocument.body.appendChild(o)%2Co.select()%2Cdocument.execCommand(%22copy%22)%2Cdocument.body.removeChild(o)%2Cconsole.log(%22string%20coppied!%22)%7D%3BcopyToClipboard(%22%24PLACEHOLDER%24%22)%3B%7D)()`;
  const stringCopyBookmarkletPlaceholder = "%24PLACEHOLDER%24"; // %24 == $

  e.querySelector("#bookmarkletForm").addEventListener('submit', (ev) => {
    ev.preventDefault();
    e.querySelector("#bookmarkletResult").innerHTML = '';

    const nameValue = e.querySelector("#bookmarkletName").value;
    const stringValue = e.querySelector("#bookmarkletString").value;

    const stringCopyContent = stringCopyBookmarklet.replace(stringCopyBookmarkletPlaceholder, stringValue);

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