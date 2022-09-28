
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
 */

const BLOCK_NAME = "youtube-timestamps";

const removeItself = () => {
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
    el.parentNode.removeChild(el);
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

  function saveVideoScreenshot(timestamps) {
    const { seconds, isoFormatted } = timestamps;
    const { videoId } = getVideoInfo();
    // timestamp is iniatialy formatted as "hh:mm:ss.mm", then formatted to "hhmmss"
    const filenameSafeTimestamp = isoFormatted.split('.')[0].replace(/:/g,"");

    callSeek(seconds);

    // workaround to give time to seek/time-travel
    setTimeout(() => {
      let videoEl = document.querySelector(".video-stream");
      let canvasEl = document.createElement("canvas");
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;

      if (!videoEl.paused) {
        videoEl.pause();
        updateMediaControlLabel(mediaState.play);
      }

      canvasEl.getContext('2d').drawImage(videoEl, 0, 0);

      let anchorEl = document.createElement("a");
      anchorEl.href = canvasEl.toDataURL();
      anchorEl.download = `${videoId} - ${filenameSafeTimestamp} - ${videoEl.videoWidth}x${videoEl.videoHeight}.png`;
      anchorEl.click();

      nukeElement(canvasEl);
      nukeElement(anchorEl);
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
        font-size: .75rem;
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
      #${BLOCK_NAME} #list {
        font-size: 1.25rem;
        list-style: none;
      }
      #${BLOCK_NAME} #list li {
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

    <div id="list-container">
      <ul id="list"></ul>
    </div>

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
          <input type="text" id="custom-time-control-amount"/>
          <button class="time-control" data-amount="x">
            #
          </button>
        </div>

    <button class="time-control" data-amount=".5"> +.5s </button>
    <button class="time-control" data-amount="1"> +1s </button>
    <button class="time-control" data-amount="5"> +5s </button>

        <select class="fb-100" name="copyCommandSelect" id="copyCommandSelect">
      <option value="video" selected>Video download command</option>
      <option value="video-squared">Video (squared) download command</option>
      <option value="video-portrait">Video (portrait) download command</option>
      <option value="audio">Audio download command</option>
    </select>

        <button class="fb-100 mb-1" id="copyCommand">Copy selected command</button>

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
    e.querySelector("#list").appendChild(entry);

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

    switch(selectedOption) {
      case 'video':
        terminalCommand += ` "${videoTitle}.mp4"`;
        break;
      case 'video-squared':
        terminalCommand += ` -vf "crop=in_h" "${videoTitle}.mp4"`;
        break;
      case 'video-portrait':
        terminalCommand += ` -vf "crop='9/16*in_h':in_h" "${videoTitle}.mp4"`;
        break;
      case 'audio':
        terminalCommand += ` "${videoTitle}.mp3"`;
        break;
      default:
        displayError("Invalid option: can't copy command");
    }

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
