
/**
 * refs:
 *  - browser-sync element style
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
 *  - https://www.delftstack.com/howto/javascript/javascript-get-url/
 *  - https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
 */

const BLOCK_NAME = "block-youtube-timestamps";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
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
    return [currentSeconds, fromSecondsToISO(currentSeconds)];
  }

  function getDownloadInterval(blockElement) {
    try {
      let start = blockElement.querySelector('input[name="start"]:checked').value;
      let startSeconds = blockElement.querySelector('input[name="start"]:checked').dataset.seconds;
      let end = blockElement.querySelector('input[name="end"]:checked').value;
      let offset = 5; // this is used so audio is not out of sync with video at start
      let offsetStart = fromSecondsToISO(startSeconds - Number(offset));

      return { start, startSeconds, end, offset, offsetStart };
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

  function saveVideoScreenshot(timestamp) {
    const { videoId } = getVideoInfo();
    // timestamp is iniatialy formatted as "hh:mm:ss.mm", then formatted to "hhmmss"
    const filenameSafeTimestamp = timestamp.split('.')[0].replace(/:/g,"");

    // workaround to give time to seek/time-travel when clicked on a timestamp (bubble from entry click)
    setTimeout(() => {
      let videoEl = document.querySelector(".video-stream");
      let canvasEl = document.createElement("canvas");
      canvasEl.width = 1280;
      canvasEl.height = 720;

      if (!videoEl.paused) {
        videoEl.pause();
        updateMediaControlLabel(mediaState.play);
      }

      canvasEl.getContext('2d').drawImage(videoEl, 0, 0);

      let anchorEl = document.createElement("a");
      anchorEl.href = canvasEl.toDataURL();
      anchorEl.download = `${videoId} - ${filenameSafeTimestamp}.png`;
      anchorEl.click();

      canvasEl = null;
      anchorEl = null;
    }, 300);
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

  let e = document.createElement("div");
  e.id = BLOCK_NAME;
  e.style.display = "block";
  e.style.padding = "10px 15px";
  e.style.fontFamily = "sans-serif";
  e.style.position = "fixed";
  e.style.fontSize = ".985rem";
  e.style.zIndex = "9999";
  e.style.right = "0px";
  e.style.top = "0px";
  e.style.borderBottomLeftRadius = "5px";
  e.style.backgroundColor = "rgba(27, 32, 50, .9)";
  e.style.margin = "0px";
  e.style.color = "white";
  e.style.textAlign = "center";

  e.innerHTML = `
    <style>
      #${BLOCK_NAME} h1 {
        margin: .5rem 0;
      }
      #${BLOCK_NAME} button {
        line-height: 1.2em;
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
      #${BLOCK_NAME} #alert {
        position: absolute;
        bottom: -2rem;
        left: 50%;
        transform: translateX(-50%);
        padding: .25rem .75rem;
        background-color: #222;
        color: #fff;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        display: none;
      }
    </style>

    <span id="alert"></span>

    <h1>YouTube Timestamps</h1>
    <div id="list-container">
      <ul id="list"></ul>
    </div>

    <button id="createTimestampTrigger">Snapshot timestamp</button>

    <button id="mediaControlTrigger">${ mediaState.play }</button>

    <br><br>

    <button class="time-control" data-amount="-5"> -5s </button>
    <button class="time-control" data-amount="-1"> -1s </button>
    <button class="time-control" data-amount="-.5"> -.5s </button>
    <button class="time-control" data-amount=".5"> +.5s </button>
    <button class="time-control" data-amount="1"> +1s </button>
    <button class="time-control" data-amount="5"> +5s </button>

    <br><br>

    <button style="display:block;width:100%" id="copyVideoCommand">Copy video download command</button>
    <button style="display:block;width:100%" id="copyAudioCommand">Copy audio download command</button>

    <br>
  `;

  let close = document.createElement("button");
  close.onclick = () => { removeItself() };
  close.innerHTML = "Close";
  e.append(close);

  document.body.append(e);

  const videoStream = document.querySelector(".video-stream");
  if (videoStream.paused) {
    updateMediaControlLabel(mediaState.play);
  } else {
    updateMediaControlLabel(mediaState.pause);
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
    var display = getTimestamps();

    var entry = document.createElement('li');
    entry.innerHTML = `
      [<input type="radio" name="start" value="${display[1]}" data-seconds="${display[0]}">
      <span> ${display[0]} - ${display[1]}</span>
      <input type="radio" name="end" value="${display[1]}" data-seconds="${display[0]}">]
    `;
    entry.onclick = () => { callSeek(display[0]) };
    e.querySelector("#list").appendChild(entry);

    var screenshot = document.createElement('button');
    screenshot.title = `Save screenshot at ${display[1]}`;
    screenshot.innerHTML = "📸";
    screenshot.onclick = () => { saveVideoScreenshot(display[1]) };
    entry.appendChild(screenshot);
  });

  e.querySelectorAll('.time-control').forEach(item => {
    item.addEventListener('click', event => {
      try {
        timeTravel(event.target.dataset.amount);
      } catch (e) {
        displayError('No video detected');
      }
    });
  });

  e.querySelector("#copyVideoCommand").addEventListener('click', () => {
    const { offset, offsetStart, end } = getDownloadInterval(e);
    const videoUrl = window.location.href;
    // const videoTitle = document.title; // sadly this cant always be trusted
    const videoTitle = new Date().toISOString().substring(0, 19).replace("T", "-").replace(/:/g, "");
    const terminalCommand = `ffmpeg -ss ${offsetStart} -to ${end} -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest '${videoUrl}')" -ss ${offset} "${videoTitle}.mp4"`;

    copyToClipboard(terminalCommand);
  });

  e.querySelector("#copyAudioCommand").addEventListener('click', () => {
    const { offset, offsetStart, end } = getDownloadInterval(e);
    const videoUrl = window.location.href;
    const audioTitle = new Date().toISOString().substring(0, 19).replace("T", "-").replace(/:/g, "");
    const terminalCommand = `ffmpeg -ss ${offsetStart} -to ${end} -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest '${videoUrl}')" -ss ${offset} "${audioTitle}.mp3"`;

    copyToClipboard(terminalCommand);
  });

}
