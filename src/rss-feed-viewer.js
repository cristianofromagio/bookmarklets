
/**
 * refs:
 *  - https://grrr.tech/posts/create-dom-node-from-html-string/
 *  - https://stackoverflow.com/a/7394787
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
 *  - https://sentry.io/answers/how-do-i-auto-resize-an-image-to-fit-a-div-container/
 *  - https://github.com/GoogleChrome/dialog-polyfill/blob/master/dist/dialog-polyfill.css
 *  - https://codepen.io/chriscoyier/pen/ZEGzzeX - rss feed in javascript
 *  - https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/
 *  - https://www.toptal.com/developers/feed2json/#conversion
 *  - https://unity.com/pt/releases/editor/lts-releases.xml
 *  - https://www.toptal.com/blog.rss
 *  - https://www.inovacaotecnologica.com.br/boletim/rss.xml
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors
 *  - https://codepen.io/havardob/pen/RwVbaLo - card styling
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
 *  -
 * limitations:
 *  - dialog element
 *  - simple and limited parsing capabilities (lots of different namespaces)
 */

const BLOCK_NAME = "rss-feed-viewer";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  let content, parsedContent;

  let xmlPreviewDocument = document.querySelector("#webkit-xml-viewer-source-xml");
  if (xmlPreviewDocument) {
    parsedContent = xmlPreviewDocument.querySelector("rss");
  } else {
    if (document.body) {
      content = document.body.textContent;
    } else {
      content = document.firstChild.outerHTML;
    }

    parsedContent = new window.DOMParser().parseFromString(content, "text/xml");
  }

  function decodeHtml(htmlEntitiesString) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html.toString();
    return txt.value;

    // let doc = new DOMParser().parseFromString(htmlEntitiesString, "text/html");
    // console.log(doc.documentElement);
    // return doc.documentElement.querySelector("body").textContent;
  }

  const htmlToElement = (htmlString) => {
    // const placeholder = document.createElement("div");
    // placeholder.insertAdjacentHTML("afterbegin", decodeHtml(html.toString()));
    // return placeholder.firstElementChild;

    let dom = new DOMParser().parseFromString(htmlString, 'text/html');
    return dom.body.firstElementChild;
  };

  const dialogEl = htmlToElement(`
    <dialog id="${BLOCK_NAME}" class="fixed">
      <style>
        *, *:after, *:before {
          box-sizing: border-box;
        }

        dialog {
          position: absolute;
          left: 0; right: 0;
          /*width: -moz-fit-content;*/
          /*width: -webkit-fit-content;*/
          /*width: fit-content;*/
          /*height: -moz-fit-content;*/
          /*height: -webkit-fit-content;*/
          /*height: fit-content;*/
          margin: auto;
          border: solid;
          padding: 1em;
          background: white;
          color: black;
          display: block;
        }

        dialog {
          width: 80vw;
          height: 80vh;
          overflow: scroll;
          font-family: sans-serif;
        }

        dialog.fixed {
          position: fixed;
          top: 50%;
          transform: translate(0, -50%);
        }

        details {
          display: block;
          width: 100%;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 50px 0 rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 0.5em 0.5em 0;
        }

        summary {
          font-weight: bold;
          margin: -0.5em -0.5em 0;
          padding: 0.5em;
        }

        details[open] {
          padding: 0.5em;
        }

        details[open] summary {
          border-bottom: 1px solid #ddd;
          margin-bottom: 0.5em;
        }






        .card {
          background-color: #FFF;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 50px 0 rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          overflow: hidden;
          padding: 1.25rem;
          position: relative;
          transition: 0.15s ease-in;
          margin-bottom: 1.25rem;
        }
        /*.card:hover, .card:focus-within {
          box-shadow: 0 0 0 2px #16C79A, 0 10px 60px 0 rgba(0, 0, 0, 0.1);
          transform: translatey(-5px);
        }*/

        .card-image {
          border-radius: 10px;
          overflow: hidden;
          max-height: 200px;
          width: 100%;
          margin: auto 0 .975rem;
        }

        .card-image img {
          object-fit: contain;
          width: 100%;
          height: 100%;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
        }
        .card-header a {
          font-weight: 600;
          font-size: 1.375rem;
          line-height: 1.25;
          padding-right: 1rem;
          text-decoration: none;
          color: inherit;
          will-change: transform;
        }
        .card-header a:after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }

        .card-footer {
          margin-top: 1.25rem;
          border-top: 1px solid #ddd;
          padding-top: 1.25rem;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .card-meta {
          display: flex;
          align-items: center;
          color: #787878;
        }
        .card-meta:first-child:after {
          display: block;
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: currentcolor;
          margin-left: 0.75rem;
          margin-right: 0.75rem;
        }
        .card-meta svg {
          flex-shrink: 0;
          width: 1em;
          height: 1em;
          margin-right: 0.25em;
        }

      </style>
    </dialog>
  `);

  const meta = document.createDocumentFragment();
  let mImage = parsedContent.querySelector("channel > image"),
    mTitle = parsedContent.querySelector("channel > title, title"),
    mLink = parsedContent.querySelector("channel > link"),
    mLinkAlternate = parsedContent.querySelector("link[rel='alternate']"),
    mDescription = parsedContent.querySelector("channel > description, subtitle"),
    imageTitle;
  let imageLink = (mImage) ? mImage.querySelector("link") : false;

  const metaContent = `
    <article class="card">
      ${ (mImage)
        ? `<figure class="card-image">
            ${ (imageLink) ? `<a href="${imageLink.textContent}" target="_blank" rel="noopener">` : ``}
            <img
              src="${ mImage.querySelector("url").textContent }"
              title="${ (imageTitle = mImage.querySelector("title")) ? imageTitle.textContent : mTitle.textContent }"
              style="${ (mImage.querySelector("height")) ? `height: ${mImage.querySelector("height").textContent}` : ``}"/>
              ${ (imageLink) ? `</a>` : ``}
          </figure>`
        : ``
      }
      <div class="card-header">
        <a href="${(mLink) ? mLink.textContent : mLinkAlternate.getAttribute("href") }" title="${mTitle.textContent}" target="_blank" rel="noopener">
          RSS Feed - ${mTitle.textContent}
        </a>
        ${ (mDescription)
          ? `<div class="card-meta" style="font-weight: bold">
              ${ mDescription.textContent }
            </div>`
          : ``
        }
      </div>
    </article>`;
  let metaContentNode = htmlToElement(metaContent);
  meta.appendChild(metaContentNode);

  const fragment = document.createDocumentFragment();
  const items = parsedContent.querySelectorAll("item, entry");
  items.forEach((el) => {
    let elImage = el.querySelector("image"),
      elLink = el.querySelector("link"),
      elLinkAlt = el.querySelector("link[rel='alternate']"),
      elTitle = el.querySelector("title"),
      elPublish = el.querySelector("pubDate, published"),
      elDescription = el.querySelector("description, summary");
    let mediasList = el.getElementsByTagName('media\:content');
    let elContent = `
      <article class="card">
        ${ (mediasList.length > 0 && mediasList[0].getAttribute("medium") == "image")
          ? `<figure class="card-image">
              <img src="${ mediasList[0].getAttribute("url") }" />
            </figure>`
          : ``
        }
        ${ (elImage)
          ? `<figure class="card-image">
              <img src="${ elImage.querySelector("url").textContent }" />
            </figure>`
          : ``
        }
        <div class="card-header">
          <a href="${(elLinkAlt) ? elLinkAlt.getAttribute("href") : elLink.innerHTML}" target="_blank" rel="noopener"></a>
          ${ (elPublish)
            ? `<div class="card-meta card-meta--date">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" display="block" id="Calendar">
                <rect x="2" y="4" width="20" height="18" rx="4" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M2 10h20" />
              </svg>
              ${elPublish.textContent}
            </div>`
            : ``
          }
        </div>

        <div class="card-footer">
          <details>
            <summary>Description</summary>
          </details>
        </div>
      </article>`;

    const node = htmlToElement(`<div>${ elContent }</div>`);
    const parsedTitle = htmlToElement(`<div>${ elTitle.textContent }</div>`);
    node.querySelector("a").appendChild(parsedTitle);

    const parsedDescription = htmlToElement(`<div>${ elDescription.textContent }</div>`);
    node.querySelector("details").appendChild(parsedDescription);
    fragment.appendChild(node);
  });

  dialogEl.appendChild(meta);
  dialogEl.appendChild(fragment);
  if (document instanceof XMLDocument) {
    document.firstChild.appendChild(dialogEl)
  } else {
    document.body.appendChild(dialogEl);
  }
  dialogEl.show();

}
