
/**
 * refs:
 *  - browser-sync element style
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
 *  - https://www.delftstack.com/howto/javascript/javascript-get-url/
 *  - https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight
 *  - https://fonts.google.com/icons
 *  - https://editor.method.ac/
 *  - https://jakearchibald.github.io/svgomg/
 *  - https://www.delftstack.com/howto/javascript/check-if-string-is-number-javascript/
 *  - https://www.javascripttutorial.net/javascript-throw-exception/
 *  - https://web.archive.org/web/20160529021018/https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
 *  - https://stackoverflow.com/questions/3768565/drawing-an-svg-file-on-a-html5-canvas
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
 *  - https://www.freecodecamp.org/news/how-to-center-an-absolute-positioned-element/
 *  -
 */

const BLOCK_NAME = "youtube-timestamps";

const removeItself = () => {
  window.blockFn.nukeElement(document.querySelector("#svg-resolution-overlay"));

  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
  window.blockFn = undefined;
};

const displayError = (msg) => {
  alert(msg);
};

const copyToClipboard = (content) => {
  const el = document.createElement('textarea');
  el.value = content;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  displayAlert('Command copied!');
};

let displayingTimeout;
const displayAlert = (message) => {
  const alert = document.querySelector('#'+BLOCK_NAME+' #alert');
  alert.innerText = message;
  alert.style.display = 'inline-block';
  clearTimeout(displayingTimeout);
  displayingTimeout = setTimeout(() => {
    alert.innerText = '';
    alert.style.display = 'none';
  }, 3000);
}

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  window.blockFn = {};
  window.blockFn.removeItself = removeItself;

  function nukeElement(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    el = null;
  }
  window.blockFn.nukeElement = nukeElement;

  function getVideoInfo() {
    try {
      const video = document.querySelector(".video-stream");
      const videoId = (new URL(document.location)).searchParams.get("v");

      return { video, videoId };
    } catch(err) {
      displayError('Unable to get video');
    }
  }

  function getTimestamps() {
    let video = document.querySelector(".video-stream");
    let currentSeconds = video.currentTime;
    return {
      seconds: currentSeconds,
      isoFormatted: fromSecondsToISO(currentSeconds)
    };
  }

  function getDownloadInterval(blockElement) {
    try {
      let start = blockElement.querySelector('input[name="start"]:checked').value;
      let end = blockElement.querySelector('input[name="end"]:checked').value;

      if (!start && !end) return;

      let startSeconds = blockElement.querySelector('input[name="start"]:checked').dataset.seconds;
      let offset = Number(5); // this is used so audio is not out of sync with video at start
      let offsetStartSeconds = 0;

      // if offset is bigger than start, there is padding to use
      if (startSeconds >= offset) {
        offsetStartSeconds = startSeconds - offset;
      }

      // if offset would put start at negative, use start instead (no offset)
      if ((startSeconds - offset) < Number(0)) {
        offsetStartSeconds = startSeconds;
      }

      let offsetStart = fromSecondsToISO(offsetStartSeconds);

      return { start, startSeconds, end, offset, offsetStart, offsetStartSeconds };
    } catch (err) {
      displayError('Select a start / end timestamp');
    }
  }

  function fromSecondsToISO(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 11);
  }

  function callSeek(time) {
    document.querySelector(".video-stream").currentTime = time;
  }
  window.blockFn.callSeek = callSeek;

  function resolutionOverlaySvg(width = 1920, height = 1080, opacity = 1) {
    const resolutionOverlay = `
    <svg id="svg-resolution-overlay" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 508 285.8">
      <g opacity="${opacity}">
        <g color="#000" paint-order="markers stroke fill">
          <path fill="#ff050c" d="M0 0v285.7h508V0H0zm.5.5h507v284.7H.5V.5z"/>
          <path fill="none" d="M.3.3h507.4v285.2H.3z"/>
        </g>
        <path fill="#ff050c" d="M.3.3h25.1v15H.3z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="M7 10.8H3V9.7h1.2V6.4H3v-1h.6l.5-.1.3-.3.1-.4h1.4v5.1H7zm6.4-2.1-.1.9-.5.7q-.3.3-.8.4-.4.2-1 .2l-1-.1-.8-.5q-.4-.4-.6-1T8.4 8q0-.8.2-1.4.2-.6.6-1.1.4-.5 1-.7.7-.3 1.6-.3h.7l.4.1v1.2h-.1l-.4-.1h-.6q-.8 0-1.2.3-.5.4-.6 1.1l.7-.3.8-.1h.6l.6.3.5.7q.2.4.2 1zm-1.8 1 .2-.4v-1l-.3-.4-.3-.1H10v.5l.1.8.3.5.2.2h.7q.2 0 .3-.2zm4.8-1.9h-1.6V6h1.6zm0 3h-1.6V9h1.6zm6.4-3.5q0 .8-.2 1.5t-.7 1.1q-.4.5-1 .7-.7.3-1.6.3h-.6l-.5-.1V9.6h.2l.3.1H20q.3 0 .5-.3L21 9q.2-.3.2-.7l-.6.3-.8.1H19l-.5-.3q-.4-.3-.6-.7-.2-.4-.2-1 0-1 .7-1.6.7-.6 1.8-.6l1 .1.8.5q.4.4.6 1l.1 1.2zm-1.6-.2-.1-.8-.3-.5-.3-.2H20q-.2 0-.3.2l-.2.3v1q0 .2.2.3l.4.2h.8l.4-.1v-.4z" aria-label="16:9"/>
        <g fill="#ff050c" color="#000" paint-order="markers stroke fill">
          <path d="M25.4 0v285.8h457.2V0H25.4zm.5.5h456.2v284.7H25.9V.5z"/>
          <path fill-opacity=".1" d="M25.7.3h456.6v285.2H25.7z"/>
        </g>
        <path fill="#fb0014" d="M461.7.3h20.6v15h-20.6z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="M470 9q0 .9-.7 1.4-.7.5-2 .5l-1-.1-.9-.4-.5-.6-.1-.7q0-.5.3-.8.2-.4 1-.7-.6-.2-.9-.6t-.2-.9q0-.7.6-1.2.7-.4 1.8-.4t1.8.4q.6.4.6 1.1 0 .5-.2.8l-.9.6q.7.2 1 .7t.3 1zm-1.7-2.8q0-.3-.3-.5-.2-.2-.6-.2h-.3q-.2 0-.3.2l-.2.1v.7l.5.2.3.2.5.1.3-.4v-.4zm.1 3-.1-.5-.6-.4-.4-.1-.5-.2-.3.4-.1.5q0 .4.3.7.3.2.8.2h.3l.3-.1.2-.2.1-.4zm4.5-1.5h-1.6V6.1h1.6zm0 3h-1.6V9.2h1.6zm6.4-2q0 .5-.2.9l-.5.7q-.4.3-.9.4-.5.2-1.1.2l-1.3-.1-.8-.3V9.2h.2l.8.3.8.2h.6l.5-.3.2-.3v-.7l-.3-.3-.5-.2h-1.3l-.6.2h-.2V4.6h4.4v1.2h-2.9v1h1.6l.7.3.6.6q.2.4.2 1z" aria-label="8:5"/>
        <g fill="#ff050c" color="#000" paint-order="markers stroke fill">
          <path d="M63.5 0v285.8h381V0h-381zm.5.5h380v284.8H64V.5z"/>
          <path fill-opacity=".1" d="M63.7.2h380.6v285.3H63.7z"/>
          <path d="M75.4 0v285.8h357.2V0H75.4zm.5.5H432v284.8H76V.5z"/>
          <path fill-opacity=".1" d="M75.6.2h356.8v285.3H75.6z"/>
          <path d="M111.1 0v285.8H397V0H111zm.4.4h285v285h-285V.4z"/>
          <path fill-opacity=".1" d="M111.3.2h285.4v285.4H111.3z"/>
          <path d="M173.6 0v285.8h160.8V0H173.6zm.3.3H334v285.1H174V.3z"/>
          <path fill-opacity=".2" d="M173.7.2h160.6v285.4H173.7z"/>
        </g>
        <path fill="#ff050c" d="M173.7.2H199v15h-25.2z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="M181 7.2q0 .8-.2 1.5-.2.6-.6 1-.4.6-1 .8-.7.3-1.6.3h-.6l-.5-.1V9.5h.5q.2.2.6.2l.7-.1.5-.3.4-.4q.2-.3.2-.7l-.6.3-.8.1h-.7l-.6-.3-.5-.7q-.2-.4-.2-1 0-1 .7-1.6.7-.6 1.8-.6l1 .1.8.5q.3.3.5.9.2.5.2 1.3zm-1.6-.2v-.8q-.1-.4-.3-.5-.1-.2-.3-.2h-.6q-.2 0-.3.2l-.2.3-.1.5V7l.3.3.4.2h.8l.3-.1V7zm4.6.6h-1.5V6h1.6zm0 3h-1.5V9h1.6zm6.2.1h-4.1V9.6h1.3V6.3H186v-1h.6l.4-.1.3-.3.2-.4h1.3v5h1.3zm6.4-2.1-.2.9q-.1.4-.5.7-.3.3-.7.4l-1 .2q-.6 0-1-.2-.5-.1-.9-.4l-.5-1q-.2-.5-.2-1.3t.2-1.4q.1-.7.6-1.1.4-.5 1-.8.7-.2 1.6-.2h1.1v1.3h-.2l-.4-.1h-.6q-.8 0-1.2.3-.4.4-.5 1l.6-.2.8-.1h.7l.5.3q.4.2.6.6l.2 1zm-1.9.9.2-.3.1-.6v-.5l-.3-.3-.4-.1h-1.1V9l.3.5.3.2h.6q.2 0 .3-.2z" aria-label="9:16"/>
        <path fill="#ff050c" d="M63.7.2h19.8v15.2H63.7z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="M71.7 9.3H71v1.5h-1.5V9.3h-3V8.2l2.9-3.6H71v3.6h.8zm-2.3-1.1V6l-1.8 2.2zm5.1-.5H73V6.1h1.5zm0 3H73V9.1h1.5zm6-2.8q.2.1.3.4t0 .6v.8q-.2.4-.6.6l-.8.4q-.5.2-1.2.2t-1.3-.2q-.5 0-.9-.2V9h.2l.8.4 1 .2h.5l.4-.3q.2 0 .3-.2v-.8l-.4-.3h-1.3V7h.9l.4-.1.3-.3V6q-.1-.2-.3-.2l-.3-.1h-1.3l-.8.5h-.2V4.8l1-.2 1.1-.1h1l.8.3.5.5q.2.3.1.7 0 .5-.3 1-.3.3-.8.4l.4.2q.3 0 .5.3z" aria-label="4:3"/>
        <path fill="#ff050c" d="M412.6.2h19.8v15.1h-19.8z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="m420 8.6-.1 1-.6.6q-.3.4-.8.5-.5.2-1.2.2t-1.2-.2q-.5 0-.8-.2V9h.1l.8.4.9.1h.6q.3 0 .4-.2l.3-.3v-.8l-.3-.2q-.2-.2-.6-.2h-1.2l-.6.1h-.2V4.6h4.4v1.2h-3v1h1.7l.6.3q.4.2.6.6.2.4.2 1zm3-.9h-1.5V6.1h1.6zm0 3h-1.5V9.1h1.6zm6.7-1.4h-.9v1.4h-1.5V9.3h-3V8.1l3-3.5h1.5v3.6h.9zm-2.4-1.1V6l-1.8 2.2z" aria-label="5:4"/>
        <path fill="#ff050c" d="M111.3.2h19.8v15.1h-19.8z" paint-order="markers stroke fill"/>
        <path fill="#fff" d="M118.6 10.7h-4.1v-1h1.3V6.3h-1.3v-1h.5l.5-.2q.2 0 .3-.3l.1-.4h1.4v5.1h1.3zm3.3-3h-1.6V6h1.6zm0 3h-1.6V9.1h1.6zm6.1 0h-4.1v-1h1.3V6.3h-1.3v-1h.6l.4-.2q.2 0 .3-.3l.2-.4h1.3v5.1h1.3z" aria-label="1:1"/>
      </g>
    </svg>
    `;
    return resolutionOverlay;
  }

  function saveVideoScreenshot(timestamps) {
    const { seconds, isoFormatted } = timestamps;
    const { video: videoEl, videoId } = getVideoInfo();
    // timestamp is iniatialy formatted as "hh:mm:ss.mm", then formatted to "hhmmss"
    const filenameSafeTimestamp = isoFormatted.split('.')[0].replace(/:/g,"");

    callSeek(seconds);

    // workaround to give time to seek/time-travel
    setTimeout(() => {
      let canvasEl = document.createElement("canvas");
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;

      if (!videoEl.paused) {
        videoEl.pause();
        updateMediaControlLabel(mediaState.play);
      }

      canvasEl.getContext('2d').drawImage(videoEl, 0, 0);

      const includeResolutionOverlay = document.querySelector("#toggleResolutionSvg").checked;

      if (includeResolutionOverlay) {
        let DOMURL = window.URL || window.webkitURL || window;
        let img = new Image();
        const svgBlob = new Blob([resolutionOverlaySvg(videoEl.videoWidth, videoEl.videoHeight, '.5')], { type: "image/svg+xml;charset=utf-8" });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = (ev) => {
          canvasEl.getContext('2d').drawImage(img, 0, 0);

          let anchorEl = document.createElement("a");
          anchorEl.href = canvasEl.toDataURL();
          anchorEl.download = `${videoId} - ${filenameSafeTimestamp} - ${videoEl.videoWidth}x${videoEl.videoHeight}.png`;
          anchorEl.click();

          DOMURL.revokeObjectURL(url);
          nukeElement(canvasEl);
          nukeElement(anchorEl);
        };
        img.src = url;

      } else {
        let anchorEl = document.createElement("a");
        anchorEl.href = canvasEl.toDataURL();
        anchorEl.download = `${videoId} - ${filenameSafeTimestamp} - ${videoEl.videoWidth}x${videoEl.videoHeight}.png`;
        anchorEl.click();

        nukeElement(canvasEl);
        nukeElement(anchorEl);
      }

    }, 150);
  }

  function timeTravel(amount) {
    let video = document.querySelector(".video-stream");
    let newDuration = video.currentTime + Number(amount);
    video.currentTime = newDuration;
  }

  function updateMediaControlLabel(label) {
    let mediaBtn = document.querySelector("#mediaControlTrigger");
    mediaBtn.innerText = label;
  }

  const mediaState = {
    play: '▶️ Play',
    pause: '⏸️ Pause'
  }

  let e = document.createElement("details");
  e.id = BLOCK_NAME;
  e.setAttribute("open", "");
  e.innerHTML = `
    <style>
      #${BLOCK_NAME} {
        display: block;
        padding: 0;
        font-family: sans-serif;
        position: fixed;
        font-size: 16px;
        z-index: 9999;
        right: 0;
        top: 0;
        border-radius: 5px;
        background-color: rgba(27, 32, 50, .9);
        margin: auto;
        color: white;
        border: 3px solid #4d646f;
        text-align: center;
        width: 300px;
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
      }
      #${BLOCK_NAME} button.time-control {
        padding: 0 .5em;
        text-transform: lowercase;
        flex: 1;
      }
      #${BLOCK_NAME} input[type=text] {
        color: #262626;
        font-size: 16px;
        line-height: 20px;
        min-height: 28px;
        border-radius: 3px;
        padding: 8px;
        background: #FBFBFB;
        margin: 0;
        box-sizing: border-box;
        width: 100%;
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
      .${BLOCK_NAME}-action-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      #${BLOCK_NAME} .move-handler {
      	float: right;
        font-weight: bolder;
        padding: .125rem .5rem;
        margin-top: -.125rem;
        background-color: rgba(0,0,0,.1);
        border-radius: 3px;
        cursor: move;
      }

      #${BLOCK_NAME} .fb-100 {
        flex-basis: 100%;
      }
      #${BLOCK_NAME} .mb-1 {
        margin-bottom: .5rem;
      }
      #${BLOCK_NAME} #timestamp-list {
        font-size: 1.25rem;
        list-style: none;
        margin: 0;
      }
      #${BLOCK_NAME} #timestamp-list li {
        cursor: pointer;
        padding-bottom: .25em;
        transition: all .3s ease;
      }
      #${BLOCK_NAME} .custom-time-control {
        display: flex;
        flex-direction: column;
        margin: 3px;

      }
      #${BLOCK_NAME} .custom-time-control input {
        padding: 0;
        margin: 0;
        text-align:center;
        min-height: auto;
        font-size: 12px;
        height: 16px;
        font-family: sans-serif;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border: 0;
      }
      #${BLOCK_NAME} .custom-time-control input:focus {
        outline: none;
      }
      #${BLOCK_NAME} .custom-time-control button {
        margin: 0;
        line-height: 14px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      #${BLOCK_NAME} .timestamp-delete,
      #${BLOCK_NAME} .timestamp-screenshot {
        padding: 0 .75em;
      }
      #${BLOCK_NAME} .timestamp-delete span::after,
      #${BLOCK_NAME} .timestamp-screenshot span::after {
        content: "";
        background-size: 100%;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 2px;
        width: 14px;
        height: 14px;
      }

      #${BLOCK_NAME} .timestamp-delete span::after {
        background: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="m3 14-1-1-1-1V3H0V1h4V0h6v1h4v2h-1v9l-1 1-1 1H3zm2-3h1V4H5v7zm3 0h1V4H8v7z"/></svg>') no-repeat center;
      }
      #${BLOCK_NAME} .timestamp-screenshot span::after {
        background: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M7 10h2l1-2-1-2-2-1-2 1-1 2 1 2h2zm-5 3H0V3l2-1h2l1-2h4l1 2h2l2 1v10H2z"/></svg>') no-repeat center;
      }
    </style>

    <summary>${BLOCK_NAME} <span id="moveHandler" class="move-handler">move</span></summary>

    <span id="alert"></span>

    <div style="padding: 8px">

      <ul id="timestamp-list"></ul>

      <div class="${BLOCK_NAME}-action-buttons" style="flex-wrap:nowrap">
        <button id="createTimestampTrigger">Snapshot timestamp</button>
        <button id="mediaControlTrigger">${ mediaState.play }</button>
      </div>

      <hr class="mb-1">

      <div class="${BLOCK_NAME}-action-buttons">

        <button class="time-control" data-amount="-5"> -5s </button>
        <button class="time-control" data-amount="-1"> -1s </button>
        <button class="time-control" data-amount="-.5"> -.5s </button>

        <div class="custom-time-control" style="flex:1">
          <input type="text" id="custom-time-control-amount" value=".1"/>
          <button class="time-control" data-amount="x">
            #
          </button>
        </div>

        <button class="time-control" data-amount=".5"> +.5s </button>
        <button class="time-control" data-amount="1"> +1s </button>
        <button class="time-control" data-amount="5"> +5s </button>
        </div>

      <div class="${BLOCK_NAME}-action-buttons" style="flex-wrap:nowrap">
        <button id="toggleResolutionOverlay" title="Toggle resolution overlay">Toggle res.</button>
        <label class="button" for="toggleResolutionSvg" title="Add resolution overlay to screenshots">
          <input type="checkbox" id="toggleResolutionSvg" value="yeayea">
          Add res. to <span class="timestamp-screenshot" style="padding: 0"><span></span></span>
        </label>
      </div>

      <div class="${BLOCK_NAME}-action-buttons">

        <select class="fb-100" name="copyCommandSelect" id="copyCommandSelect">
          <option value="v" selected>Video download</option>
          <option value="v11">Video (squared 1:1) download</option>
          <option value="v916">Video (portrait 9:16) download</option>
          <option value="v54">Video (5:4) download</option>
          <option value="v43">Video (4:3) download</option>
          <option value="v85">Video (8:5) download</option>
          <option value="a">Audio only download</option>
        </select>

        <button class="fb-100 mb-1" id="copyCommand">Copy selected download command</button>

        <button
          onclick="blockFn.removeItself()"
          class="fb-100">Close</button>
      </div>
    </div>
  `;

  document.body.append(e);

  const videoStream = document.querySelector(".video-stream");
  if (videoStream) {
    if (videoStream.paused) {
      updateMediaControlLabel(mediaState.play);
    } else {
      updateMediaControlLabel(mediaState.pause);
    }
  }

  e.querySelector("#mediaControlTrigger").addEventListener('click', () => {
    try {
      if (videoStream.paused) {
        videoStream.play();
        updateMediaControlLabel(mediaState.pause);
      } else {
        videoStream.pause();
        updateMediaControlLabel(mediaState.play);
      }
    } catch (e) {
      displayError('No video detected');
    }
  });

  e.querySelector("#createTimestampTrigger").addEventListener('click', () => {
    let { seconds, isoFormatted } = getTimestamps();

    let entry = document.createElement('li');
    entry.innerHTML = `
      <span onclick="blockFn.callSeek(${seconds})">
        [
        <input type="radio" name="start" value="${isoFormatted}" data-seconds="${seconds}">
        <span title="${seconds}">${isoFormatted}</span>
        <input type="radio" name="end" value="${isoFormatted}" data-seconds="${seconds}">
        ]
      </span>
      <button class="timestamp-delete" style="background-color: #8C6F61" onclick="blockFn.nukeElement(this.parentNode)"><span></span></button>
    `;
    // entry.onclick = () => { callSeek(seconds) };
    e.querySelector("#timestamp-list").appendChild(entry);

    let scrn = document.createElement('button');
    scrn.className = "timestamp-screenshot";
    // scrn.style.backgroundColor = "#61688C";
    scrn.style.backgroundColor = "#618C85";
    scrn.title = `Save screenshot at ${isoFormatted}`;
    scrn.innerHTML = "<span></span>";
    scrn.onclick = () => { saveVideoScreenshot({ seconds, isoFormatted }) };
    entry.appendChild(scrn);
  });

  e.querySelectorAll('.time-control').forEach(item => {
    item.addEventListener('click', event => {
      let errMsg = 'No video detected';
      try {
        let amount = event.target.dataset.amount;
        if (amount === "x") {
          amount = document.querySelector("#custom-time-control-amount").value.trim();
        }
        if (isNaN(amount)) {
          errMsg = 'Invalid time amount';
          document.querySelector("#custom-time-control-amount").value = '';
          throw 'NaN';
        }
        timeTravel(amount);
      } catch (e) {
        displayError(errMsg);
      }
    });
  });

  e.querySelector("#toggleResolutionOverlay").addEventListener('click', () => {
    const { video: videoEl } = getVideoInfo();
    const wrapper = videoEl.parentNode;
    const classFlag = "has-appended-resolution-overlay";

    if (!e.classList.contains(classFlag)) {
      wrapper.insertAdjacentHTML('beforeend', resolutionOverlaySvg(videoEl.clientWidth, videoEl.clientHeight, '.5'));
      const svgOverlay = document.querySelector("#svg-resolution-overlay");
      svgOverlay.style.position = "absolute";
      svgOverlay.style.top = 0;
      svgOverlay.style.left = 0;
      svgOverlay.style.right = 0;
      svgOverlay.style.margin = "0 auto";
      svgOverlay.style.zIndex = "1000";

      e.classList.add(classFlag);
    } else {
      const svgOverlay = document.querySelector("#svg-resolution-overlay");
      nukeElement(svgOverlay);
      e.classList.remove(classFlag);
    }

  });

  e.querySelector("#copyCommand").addEventListener('click', () => {

    const videoUrl = window.location.href;
    // const videoTitle = document.title; // sadly this cant always be trusted
    const videoTitle = new Date().toISOString().substring(0, 19).replace("T", "-").replace(/:/g, "");
    const selectedOption = e.querySelector("#copyCommandSelect").value;
    let terminalCommand;

    try {
      const { startSeconds, offsetStartSeconds, offset, offsetStart, end } = getDownloadInterval(e);

      terminalCommand = `ffmpeg -ss ${offsetStart} -to ${end} -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest '${videoUrl}')"`;

      // add offset only if there is offset applied to the interval
      if (startSeconds > offsetStartSeconds) {
        terminalCommand += ` -ss ${offset}`;
      }
    } catch(e) {
      return;
    }

    const commandOptions = {
      'v': ` "${videoTitle}.mp4"`,
      'v11': ` -vf "crop=in_h" "${videoTitle}.mp4"`,
      'v916': ` -vf "crop='9/16*in_h':in_h" "${videoTitle}.mp4"`,
      'v54': ` -vf "crop='5/4*in_h':in_h" "${videoTitle}.mp4"`,
      'v43': ` -vf "crop='4/3*in_h':in_h" "${videoTitle}.mp4"`,
      'v85': ` -vf "crop='8/5*in_h':in_h" "${videoTitle}.mp4"`,
      'a': ` "${videoTitle}.mp3"`
    };

    const selectedCommand = commandOptions[selectedOption];

    if (!selectedCommand) {
      displayError("Invalid option: can't copy command");
      return;
    }

    terminalCommand += selectedCommand;

    if (terminalCommand) {
      copyToClipboard(terminalCommand);
    }
  });

  let offset = [0, 0];
  let moveTriggered = false;

  const moveHandler = document.getElementById('moveHandler');

  moveHandler.addEventListener('mousedown', (ev) => {
    moveTriggered = true;
    ev.preventDefault();

    const { top, left } = e.getBoundingClientRect();

    offset = [
      left - ev.clientX,
      top - ev.clientY
    ];
  }, true);

  moveHandler.addEventListener('mouseup', () => {
    moveTriggered = false;
  }, true);

  // this is useful if moveHandler is not small,
  //  otherwise, it falls behind the positioning style update and breaks out of moving
  moveHandler.addEventListener('mouseleave', () => {
    moveTriggered = false;
  }, true);

  moveHandler.addEventListener('mousemove', (ev) => {
    if (!moveTriggered) return;
    ev.preventDefault();

    // set right to default value, needed for calculations
    // (otherwise element stretch from 0-right to the new position)
    e.style.right = 'auto';

    e.style.left = Number(ev.clientX + offset[0]) + 'px';
    e.style.top  = Number(ev.clientY + offset[1]) + 'px';
  }, true);

}
