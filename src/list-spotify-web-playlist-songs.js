
/**
 * refs:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 *  - https://stackoverflow.com/a/58998061 (add unique objects to Set)
 */

const BLOCK_NAME = "list-spotify-web-playlist-songs";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
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

const copyTextareaToClipboard = (textarea) => {
  textarea.select();
  document.execCommand('copy');
  displayAlert('All songs copied!');
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  let e = document.createElement("div");
  e.id = BLOCK_NAME;
  e.style.backgroundColor = "rgba(27, 32, 50, .9)";
  e.style.borderRadius = "5px";
  e.style.border = "3px solid #4d646f";
  e.style.color = "white";
  e.style.display = "block";
  e.style.fontFamily = "sans-serif";
  e.style.fontSize = "16px";
  e.style.margin = "auto";
  e.style.padding = "0";
  e.style.position = "fixed";
  e.style.right = "0px";
  e.style.textAlign = "center";
  e.style.top = "0px";
  e.style.zIndex = "9999";

  e.innerHTML = `

    <!-- insert miniapp element styles + content here -->

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
      }

      #${BLOCK_NAME} .d-none {
        display: none;
      }
      #${BLOCK_NAME} .d-full {
        display: block;
        margin: 4px auto;
        width: 100%;
      }
    </style>

    <span id="alert"></span>

    <div style="padding:8px 8px 0">
      <p>Songs on the playlist:</p>
      <textarea
        spellcheck="false"
        rows="8"
        cols="30"
        id="${BLOCK_NAME}-songs"
        placeholder='Click "List songs" below'
        wrap="off"
        style="white-space: pre; overflow-x: scroll"></textarea>

      <button class="d-none" id="${BLOCK_NAME}-songs-copy">copy all</button>
      <button class="d-full" id="listSongsButtonTrigger">List songs</button>
    </div>
  `;

  let close = document.createElement("button");
  close.onclick = () => { removeItself() };
  close.style.marginBottom = "1rem";
  close.innerHTML = "Close";
  e.append(close);

  document.body.append(e);

  e.querySelector("#listSongsButtonTrigger").addEventListener('click', () => {
    // find how many songs we have using
    // div["data-testid"]="playlist-tracklist" aria-rowcount (this is a number)
    const tracklistEl = document.querySelector("[data-testid='playlist-tracklist']");

    const lastParsedSong = {data: {number: 0}, el: ''};
    const songsCount = Number(tracklistEl.getAttribute("aria-rowcount")) - 1;
    const songsSelection = new Set();

    const displayContentOnTextarea = (contentSet) => {
      let multilineOutput = 'number,title,artist,cover\r\n';
      contentSet.forEach((song) => {
        multilineOutput += `${song.number},"${song.title}","${song.artist}","${song.cover}"\r\n`;
      });
      e.querySelector(`#${BLOCK_NAME}-songs`).value = multilineOutput;
      e.querySelector(`#${BLOCK_NAME}-songs-copy`).classList.add('d-full');
    };

    const parseTracklistRow = () => {

      // div["data-testid"] = "tracklist-row"
      const songsEls = tracklistEl.querySelectorAll("[data-testid='tracklist-row']");

      songsEls.forEach((songEl) => {
        const newSong = {};

        const songNumber = Number(songEl.parentElement.getAttribute("aria-rowindex")) - 1; // rowindex starts at 2
        const songDetailsEl = songEl.querySelector("[aria-colindex='2']");
        const songImg = songDetailsEl.querySelector("img");
        const songInfosEls = songDetailsEl.querySelectorAll("a");

        newSong['number'] = songNumber;
        newSong['cover'] = songImg.src;

        songInfosEls.forEach((linkEl) => {

          if (linkEl.getAttribute("data-testid") === "internal-track-link") {
            newSong['title'] = linkEl.textContent;
          } else {
            if (songInfosEls.length <= 2) { // title + (solo) artist
              newSong['artist'] = linkEl.textContent;
            } else {

              // song with featuring artists
              if (!Object.keys(newSong).includes('artist')) {
                newSong['artist'] = linkEl.textContent;
              } else {
                newSong['artist'] += ', ' + linkEl.textContent;
              }

            }
          }

        });
        // ensures set does not contains duplicate entries
        songsSelection.add(JSON.stringify(newSong, Object.keys(newSong).sort()));
        lastParsedSong['data'] = newSong;
        lastParsedSong['el'] = songEl;
      });

      // if lastParsedSong number < total songs
      // get last song element, scrollIntoView
      // recursive repeat until condition is met
      if (lastParsedSong.data['number'] == songsCount) {
        const formattedSongsSelectionSet = [...songsSelection].map(item => {
          if (typeof item === 'string') return JSON.parse(item);
          else if (typeof item === 'object') return item;
        });
        displayContentOnTextarea(formattedSongsSelectionSet);
        return;
      } else {
        lastParsedSong.el.scrollIntoView();
        setTimeout(() => {
          parseTracklistRow();
        }, 500);
      }
    };

    parseTracklistRow();

  });

  e.querySelector(`#${BLOCK_NAME}-songs-copy`).addEventListener('click', () => {
    copyTextareaToClipboard(e.querySelector(`#${BLOCK_NAME}-songs`));
  });

}
