
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
 *  - https://stackoverflow.com/a/21648197
 *  - https://stackoverflow.com/a/45609229 ('timeupdate' event listener)
 *  - https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
 *  - https://edisciplinas.usp.br/mod/resource/view.php?id=2825611
 */

// @twing-include {% include 'building_blocks/shared/partials/utils.js' %}

const BLOCK_NAME = "youtube-timestamps";

const removeItself = () => {
  window.blockFn.nukeElement(document.querySelector("#svg-resolution-overlay"));
  window.blockFn.nukeElement(document.querySelector("#svg-resolution-overlay-vertical"));
  const { video: videoEl } = window.blockFn.getVideoInfo();
  if (videoEl) videoEl.removeEventListener('timeupdate', window.blockFn.verifyIntervalLoop, true);

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

  // @twing-include {% include 'building_blocks/shared/scripts/vanilla-js-tabs-v1_0_0.min.js' %}

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
  window.blockFn.getVideoInfo = getVideoInfo;

  function getTimestamps() {
    let { video } = getVideoInfo();
    let currentSeconds = video.currentTime;
    return {
      seconds: currentSeconds,
      isoFormatted: fromSecondsToISO(currentSeconds)
    };
  }

  function getTimestampsInterval(blockElement = false) {
    if (!blockElement) {
      blockElement = document.querySelector("#"+BLOCK_NAME);
    }

    try {
      let startEl = blockElement.querySelector('input[name="start"]:checked');
      let endEl = blockElement.querySelector('input[name="end"]:checked');

      if (!startEl && !endEl) {
        throw('Select a start / end timestamps');
      }

      const start = startEl.value;
      const end = endEl.value;
      const startSeconds = startEl.dataset.seconds;
      const endSeconds = endEl.dataset.seconds;

      return { start, startSeconds, end, endSeconds };
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

  function resolutionOverlaySvg(width = 1920, height = 1080, opacity = 1, id = 'svg-resolution-overlay', isVertical = false) {
    let styleAttr = '';
    if (!!isVertical) {
      let { video: videoEl } = getVideoInfo();
      // copy centering position values directly from video element style attribute
      styleAttr += `top: ${videoEl.style.top}; left: ${videoEl.style.left}; right: auto`;
    }
    const resolutionOverlay = `
      <svg id="${id}" class="svg-resolution-overlay" style="${styleAttr}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 508 285.75">
        <g>
        <g opacity="${opacity}" stroke="#ff050c" stroke-width=".45" paint-order="markers stroke fill">
          <path fill="none" d="M.27.27h507.46v285.21H.27z"/>
          <g fill="#ff050c">
            <path fill-opacity=".05" d="M25.66.25h456.69v285.24H25.66z"/>
            <path fill-opacity=".1" d="M63.73.23h380.53v285.28H63.73z"/>
            <path fill-opacity=".12" d="M75.63.23h356.74v285.3H75.63z"/>
            <path fill-opacity=".15" d="M111.33.2h285.35v285.35H111.33z"/>
            <path fill-opacity=".2" d="M173.72.15h160.56V285.6H173.72z"/>
          </g>
        </g>
        ${(isVertical)
          ?
            `<path fill="#ff050c" d="M.27 25.27v-25h15v25zm467.08-.02v-25h15v25zm-293.63-.1v-25h15v25zm-109.99.08v-25h15v25zm353.64 0v-25h15v25zm-306.04-.03V.2h15v25z" paint-order="markers stroke fill"/>
            <g fill="#fff" stroke-width=".25" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="0" word-spacing="0">
              <text x="-22.99" y="10.84" transform="rotate(-90)">9:16</text>
              <text x="-20.99" y="74.31" transform="rotate(-90)">3:4</text>
              <text x="-20.99" y="121.91" transform="rotate(-90)">1:1</text>
              <text x="-23.99" y="184.29" transform="rotate(-90)">16:9</text>
              <text x="-20.99" y="427.88" transform="rotate(-90)">4:5</text>
              <text x="-20.99" y="477.92" transform="rotate(-90)">5:8</text>
            </g>`
          :
            `<path fill="#ff050c" d="M.27.27h25.15v15.12H.27zM461.74.25h20.61v15.12h-20.61zM173.72.15h25.15v15.12h-25.15zM63.73.23h19.81v15.12H63.73zm348.83 0h19.81v15.12h-19.81zM111.33.2h19.81v15.12h-19.81z" paint-order="markers stroke fill"/>
            <g fill="#fff" stroke-width=".25" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="0" word-spacing="0">
              <text x="2" y="12">16:9</text>
              <text x="66" y="12">4:3</text>
              <text x="113" y="12">1:1</text>
              <text x="176" y="12">9:16</text>
              <text x="415" y="12">5:4</text>
              <text x="465" y="12">8:5</text>
            </g>`
        }
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

  const SVG_ICONS = ({
    commonStartChevron: '<svg xmlns="http://www.w3.org/2000/svg" class="mx-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    init: function() {
      this.chevronHorizontal = this.commonStartChevron + '<polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>',
      this.chevronVertical = this.commonStartChevron + '<polyline points="8 18 12 22 16 18"></polyline><polyline points="8 6 12 2 16 6"></polyline><line x1="12" x2="12" y1="2" y2="22"></line></svg>',
      this.repeatLoop = '<svg xmlns="http://www.w3.org/2000/svg" class="mx-0" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m18.37 8-4.5 2.6V9H6.89v4h-2V7h8.98V5.4l4.5 2.6Zm-8.24 9h8.98v-6h-2v4h-6.98v-1.6L5.63 16l4.5 2.6V17Z"/></svg>'
      return this;
    }
  }).init();

  let e = document.createElement("details");
  e.id = BLOCK_NAME;
  e.setAttribute("open", "");
  e.innerHTML = `
    <style>
    
      // @twing-include {% include 'building_blocks/shared/styles/vanilla-js-tabs-v1_0_0.css' %}
      
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

      #${BLOCK_NAME} .fb-100 {
        flex-basis: 100%;
      }
      #${BLOCK_NAME} .mb-1 {
        margin-bottom: .5rem;
      }
      #${BLOCK_NAME} .mx-0 {
        margin-left: .125rem;
        margin-right: .125rem;
      }
      #${BLOCK_NAME} .px-2 {
        padding-left: .5rem;
        padding-right: .5rem;
      }
      #${BLOCK_NAME} .d-none {
        display: none;
      }
      #${BLOCK_NAME} .d-flex {
        display: flex;
      }
      #${BLOCK_NAME} .flex-equals > * {
        flex: 1 1 0px;
        min-width: 0;
      }
      #${BLOCK_NAME} .flex-equals > *.size-to-content {
        flex: 0 0 auto !important;
      }
      #${BLOCK_NAME} .d-inline-block {
        display: inline-block;
      }
      #${BLOCK_NAME} .ai-c {
        align-items: center;
      }
      #${BLOCK_NAME} .jc-c {
        justify-content: center;
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
        font-weigth: bold;
        font-size: 15px;
        padding: 0 6px;
      }
      #${BLOCK_NAME} .custom-time-control .btn-group {
        display: flex;
      }
      #${BLOCK_NAME} .custom-time-control .btn-group button.btn-group-start {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 1px solid #262626;
        padding-bottom: 3px;
      }
      #${BLOCK_NAME} .custom-time-control .btn-group button.btn-group-end {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
        padding-top: 2px;
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

      .svg-resolution-overlay {
        position: absolute;
        left: 0; /* should be copied from video el style, to center when vertical */
        top: 0; /* should be copied from video el style, to center when vertical */
        right: 0;
        margin: 0 auto;
        z-index: 1000;
      }
      #svg-resolution-overlay-vertical.svg-resolution-overlay {
        transform: translateY(-100%) rotate(90deg);
        transform-origin: left bottom;
      }
    </style>

    <summary>${BLOCK_NAME}</summary>

    <span id="alert"></span>

    <!-- outer element -->
    <!-- <div style="padding: 8px"> --> 

      <div class="js-tabs" id="tabs">

        <!-- Tabs headers -->
        <ul class="js-tabs__header">
          <li class="js-tabs__title">
            <span>Single</span>
          </li>
          <li class="js-tabs__title">
            <span>Multi</span>
          </li>
        </ul>

        <!-- Tab entry -->
        <div class="js-tabs__content" id="active-tab-singlevideo">
        
          <ul id="timestamp-list"></ul>

          <div class="${BLOCK_NAME}-action-buttons flex-equals" style="flex-wrap: nowrap">
            <button class="px-2" id="createTimestampTrigger">Set timestamp</button>
            <label id="intervalLoopToggle" class="button size-to-content d-none ai-c px-2" for="toggleLoopInterval" title="Loop video on set interval">
              <input type="checkbox" id="toggleLoopInterval" value="yeayea">
              ${SVG_ICONS.repeatLoop}
            </label>
            <button class="size-to-content" id="mediaControlTrigger">${ mediaState.play }</button>
          </div>
    
          <hr class="mb-1">
    
          <div class="${BLOCK_NAME}-action-buttons">
    
            <button class="time-control" data-amount="-5"> -5s </button>
            <button class="time-control" data-amount="-1"> -1s </button>
            <button class="time-control" data-amount="-.5"> -.5s </button>
    
            <div class="custom-time-control" style="flex:1">
              <input type="text" id="custom-time-control-amount" value=".1"/>
              <div class="btn-group">
                <button class="btn-group-start time-control" data-amount="-x">
                  -
                </button>
                <button class="btn-group-end time-control" data-amount="+x">
                  +
                </button>
              </div>
            </div>
    
            <button class="time-control" data-amount=".5"> +.5s </button>
            <button class="time-control" data-amount="1"> +1s </button>
            <button class="time-control" data-amount="5"> +5s </button>
            </div>
    
          <div class="${BLOCK_NAME}-action-buttons" style="flex-wrap:nowrap">
            <button id="toggleResolutionOverlay" title="Toggle resolution overlay" class="d-flex ai-c px-2">
            ${SVG_ICONS.chevronHorizontal} RES
            </button>
            <button id="toggleResolutionOverlayVertical" title="Toggle resolution overlay (vertical)" class="d-flex ai-c px-2">
              ${SVG_ICONS.chevronVertical} RES
            </button>
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

        <!-- Tab entry -->
        <div class="js-tabs__content" id="active-tab-multivideo">
          Multi tab content
        </div>

      </div>
    <!-- </div> -->
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

  function verifyIfBoundariesIsValid() {
    const selectedStart = document.querySelector("#"+BLOCK_NAME+" input[name=start]:checked");
    const selectedEnd = document.querySelector("#"+BLOCK_NAME+" input[name=end]:checked");
    const intervalLoopToggleEl = document.querySelector("#"+BLOCK_NAME+" #intervalLoopToggle");

    if (selectedStart && selectedEnd && selectedStart.value < selectedEnd.value) {
      intervalLoopToggleEl.classList.remove("d-none");
      intervalLoopToggleEl.classList.add("d-flex");
    } else {
      const toggleInput = intervalLoopToggleEl.querySelector('input');
      toggleInput.checked = false;
      const evt = new Event("change");
      toggleInput.dispatchEvent(evt);

      intervalLoopToggleEl.classList.remove("d-flex");
      intervalLoopToggleEl.classList.add("d-none");
    }
  }
  window.blockFn.boundaryClicked = verifyIfBoundariesIsValid;

  function removeTimestampEntry(el) {
    nukeElement(el.parentNode);
    verifyIfBoundariesIsValid();
  }
  window.blockFn.removeTimestampEntry = removeTimestampEntry;

  e.querySelector("#createTimestampTrigger").addEventListener('click', () => {
    let { seconds, isoFormatted } = getTimestamps();

    let entry = document.createElement('li');
    entry.innerHTML = `
      <span>
        [
        <input onclick="blockFn.boundaryClicked()" class="timestamp-boundary" type="radio" name="start" value="${isoFormatted}" data-seconds="${seconds}">
        <span title="${seconds}">${isoFormatted}</span>
        <input onclick="blockFn.boundaryClicked()" class="timestamp-boundary" type="radio" name="end" value="${isoFormatted}" data-seconds="${seconds}">
        ]
      </span>
      <button onclick="blockFn.callSeek(${seconds})">GOTO</button>
      <button class="timestamp-delete" style="background-color: #8C6F61" onclick="blockFn.removeTimestampEntry(this)"><span></span></button>
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
      let errMsg = 'Invalid time amount';
      try {
        let amount = event.target.dataset.amount;
        if (amount === "+x") {
          amount = Number(document.querySelector("#custom-time-control-amount").value.trim());
          if (amount < 0) {
            amount = Number(amount * -1);
          }
        } else if (amount === "-x") {
          amount = Number(document.querySelector("#custom-time-control-amount").value.trim());
          if (amount > 0) {
            amount = Number(amount * -1);
          }
        } else if (isNaN(amount)) {
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

  function verifyIntervalLoop() {
    const { startSeconds, endSeconds } = getTimestampsInterval();

    if (!this.paused && (this.currentTime < startSeconds || this.currentTime > endSeconds)) {
      callSeek(startSeconds);
    }
  }
  window.blockFn.verifyIntervalLoop = verifyIntervalLoop;

  e.querySelector("#toggleLoopInterval").addEventListener('change', (ev) => {
    const { video: videoEl } = getVideoInfo();
    if (ev.target.checked) {
      videoEl.addEventListener('timeupdate', verifyIntervalLoop, true);
    } else {
      videoEl.removeEventListener('timeupdate', verifyIntervalLoop, true);
    }
  });

  e.querySelector("#toggleResolutionOverlay").addEventListener('click', () => {
    const { video: videoEl } = getVideoInfo();
    const wrapper = videoEl.parentNode;
    const classFlag = "has-appended-resolution-overlay";

    if (!e.classList.contains(classFlag)) {
      wrapper.insertAdjacentHTML('beforeend', resolutionOverlaySvg(videoEl.clientWidth, videoEl.clientHeight, '.5'));
      e.classList.add(classFlag);
    } else {
      const svgOverlay = document.querySelector("#svg-resolution-overlay");
      nukeElement(svgOverlay);
      e.classList.remove(classFlag);
    }

  });

  e.querySelector("#toggleResolutionOverlayVertical").addEventListener('click', () => {
    const { video: videoEl } = getVideoInfo();
    const wrapper = videoEl.parentNode;
    const classFlag = "has-appended-resolution-overlay-vertical";

    if (!e.classList.contains(classFlag)) {
      wrapper.insertAdjacentHTML('beforeend', resolutionOverlaySvg(videoEl.clientHeight, videoEl.clientWidth, '.5', 'svg-resolution-overlay-vertical', true));
      e.classList.add(classFlag);
    } else {
      const svgOverlay = document.querySelector("#svg-resolution-overlay-vertical");
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
      const { start, end } = getTimestampsInterval();

      /*
        this snippet save multiple outputs from same input
        also uses `setpts` filter, so we dont need to use the "start 5 seconds before then ss 5 seconds"
          to fix audio-delay and/or black video start on output

        ffmpeg
        -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest 'https://www.youtube.com/watch?v=--y3Rw3a4Zs')"
        -ss 00:00:48.30 -to 00:00:53.35 -vf "setpts=PTS-STARTPTS,crop='9/16*in_h':in_h" "video-1.mp4"
        -ss 00:05:28.72 -to 00:05:34.51 -vf "setpts=PTS-STARTPTS,crop=in_h" "video-2.mp4"
      */

      terminalCommand = `ffmpeg -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest '${videoUrl}')"`;
      terminalCommand += ` -ss ${start} -to ${end}`;

    } catch(e) {
      return;
    }

    const commandOptions = {
      'v': ` -vf "setpts=PTS-STARTPTS" "${videoTitle}.mp4"`,
      'v11': ` -vf "setpts=PTS-STARTPTS,crop=in_h" "${videoTitle}.mp4"`,
      'v916': ` -vf "setpts=PTS-STARTPTS,crop='9/16*in_h':in_h" "${videoTitle}.mp4"`,
      'v54': ` -vf "setpts=PTS-STARTPTS,crop='5/4*in_h':in_h" "${videoTitle}.mp4"`,
      'v43': ` -vf "setpts=PTS-STARTPTS,crop='4/3*in_h':in_h" "${videoTitle}.mp4"`,
      'v85': ` -vf "setpts=PTS-STARTPTS,crop='8/5*in_h':in_h" "${videoTitle}.mp4"`,
      'a': ` -vf "setpts=PTS-STARTPTS" "${videoTitle}.mp3"`
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

  let targetTabs = new Tabs({
    elem: "tabs",
    open: 0
  });

  // @twing-include {% include 'building_blocks/shared/partials/move-handler.js' %}

}
