
/**
 * refs:
 *  - browser-sync element style
 *  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
 *  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
 *  - https://www.delftstack.com/howto/javascript/javascript-get-url/
 */
const removeItself = () => {
  let e = document.querySelector("#block-youtube-timestamps");
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
  const alert = document.getElementById('alert');
  alert.innerText = message;
  alert.style.display = 'inline-block';
  clearTimeout(displayingTimeout);
  displayingTimeout = setTimeout(() => {
    alert.innerText = '';
    alert.style.display = 'none';
  }, 3000);
}

function getTimestamps() {
  let video = document.querySelector(".video-stream");
  let currentSeconds = video.currentTime;
  return [currentSeconds, fromSecondsToISO(currentSeconds)];
}

function fromSecondsToISO(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 11);
}

function callSeek(time) {
  document.querySelector(".video-stream").currentTime = time;
}

function timeTravel(amount) {
  let video = document.querySelector(".video-stream");
  let newDuration = video.currentTime + Number(amount);
  video.currentTime = newDuration;
}

if (document.querySelector("#block-youtube-timestamps")) {
    removeItself();
} else {
    let e = document.createElement("div");
    e.id = "block-youtube-timestamps";
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
        #block-youtube-timestamps h1 {
          margin: .5rem 0;
        }
        #block-youtube-timestamps #list {
          font-size: 1.25rem;
          list-style: none;
        }
        #block-youtube-timestamps #list li {
          cursor: pointer;
          padding-bottom: .25em;
          transition: all .3s ease;
        }
        #block-youtube-timestamps #alert {
          position: fixed;
          top: 1rem;
          left: 1rem;
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

      <button id="playTrigger">Play</button>
      <button id="pauseTrigger">Pause</button>

      <br><br>

      <button class="time-control" data-amount="-5"> -5s </button>
      <button class="time-control" data-amount="-1"> -1s </button>
      <button class="time-control" data-amount="-.5"> -.5s </button>
      <button class="time-control" data-amount=".5"> +.5s </button>
      <button class="time-control" data-amount="1"> +1s </button>
      <button class="time-control" data-amount="5"> +5s </button>

      <br><br>

      <button id="copyCommand">Copy download command</button>
    `;

    let close = document.createElement("button");
    close.onclick = () => { removeItself() };
    close.innerHTML = "Close";
    e.append(close);

    document.body.append(e);

    e.querySelector("#createTimestampTrigger").addEventListener('click', () => {
        var display = getTimestamps();

        var entry = document.createElement('li');
        entry.innerHTML = `
          [<input type="radio" name="start" value="${ display[1] }" data-seconds="${ display[0] }">
          <span> ${ display[0] } - ${ display[1] }</span>
          <input type="radio" name="end" value="${ display[1] }" data-seconds="${ display[0] }">]
        `;
        entry.onclick = () => { callSeek(display[0]) };
        e.querySelector("#list").appendChild(entry);
    });

    e.querySelector("#playTrigger").addEventListener('click', () => {
      try {
        document.querySelector(".video-stream").play();
      } catch(e) {
        displayError('No video detected');
      }
    });
    e.querySelector("#pauseTrigger").addEventListener('click', () => {
      try {
        document.querySelector(".video-stream").pause();
      } catch(e) {
        displayError('No video detected');
      }
    });

    e.querySelectorAll('.time-control').forEach(item => {
      item.addEventListener('click', event => {
        try {
          timeTravel(event.target.dataset.amount);
        } catch(e) {
          displayError('No video detected');
        }
      });
    });

    e.querySelector("#copyCommand").addEventListener('click', () => {
      try {
        const start = e.querySelector('input[name="start"]:checked').value;
        const startSeconds = e.querySelector('input[name="start"]:checked').dataset.seconds;
        const end = e.querySelector('input[name="end"]:checked').value;
        const offset = 5; // this is used so audio is not out of sync with video at start
        const offsetStart = fromSecondsToISO(startSeconds - Number(offset));
        const videoUrl = window.location.href;
        // const videoTitle = document.title; // sadly this cant always be trusted
        const videoTitle = new Date().toISOString().substring(0,19).replace("T","-").replace(/:/g,"");
        const terminalCommand = `ffmpeg -ss ${offsetStart} -to ${end} -i "$(youtube-dl -f best --get-url --youtube-skip-dash-manifest '${videoUrl}')" -ss ${offset} "${videoTitle}.mp4"`;

        console.log(terminalCommand);
        copyToClipboard(terminalCommand);
      } catch (e) {
        displayError('Select a start / end');
      }
    });
}
