
/**
 * refs:
 *  - https://github.com/alexyorke/youtube-subscriptions-exporter
 *  - https://kb.adamsdesk.com/application/youtube-export-subscriptions/
 *    - use the 'Google Takeout CSV' format example to import a list of channels into LibreTube
 *    - save a file as 'channels.txt' with only 'links' column selected, then run:
 *        - youtube-dl --playlist-items 0 -O playlist:"%(channel_id)s,%(channel_url)s,%(channel)s" -a channels.txt > channels_csv.txt
 *        - this wil lgive a LibreTube-compatible import format (TODO: figure out some encoding/formatting errors)
 *        - add a line at the top with `Channel ID,Channel URL,Channel title` and save as .csv
 */

// @twing-include {% include 'building_blocks/shared/partials/utils.js' %}

const BLOCK_NAME = "list-youtube-subscriptions";

const removeItself = () => {
  if (TIMEOUT_POOL.length > 0) {
    TIMEOUT_POOL.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  }
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
  TIMEOUT_POOL = null;
};

const displayError = (msg) => {
  alert(msg);
};

let TIMEOUT_POOL = [];

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
  textarea.disabled = false;
  textarea.select();
  textarea.disabled = true;
  document.execCommand('copy');
  displayAlert('All subscriptions copied!');
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

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
        width: 340px;
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
      #${BLOCK_NAME} button:disabled,
      #${BLOCK_NAME} button[disabled] {
        cursor: not-allowed;
        opacity: .7;
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
      #${BLOCK_NAME} input[type=checkbox],
      #${BLOCK_NAME} input[type=radio] {
        display: inline;
        width: 1em;
        height: 1em;
        min-height: unset;
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
      .overlap-wrapper {
        position: relative;
        min-width: 320px;
        min-height: 190px;
        margin-bottom: 25px;
      }
      textarea#${BLOCK_NAME}-subs {
        margin-top: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: inline-block;
        resize: none;
      }
      #${BLOCK_NAME}-filters {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #fff;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        color: #000;
        padding: 5px 5px 0;
      }

      #${BLOCK_NAME} .d-none {
        display: none;
      }
      #${BLOCK_NAME} .d-full {
        display: block;
        margin: 4px auto;
        width: 100%;
      }
      #${BLOCK_NAME} .d-flex {
        display: flex;
      }
    </style>

    <summary>${BLOCK_NAME}</summary>

    <span id="alert"></span>

    <div style="padding: 8px">

      <div class="overlap-wrapper">
        <textarea
          spellcheck="false"
          rows="8"
          cols="30"
          id="${BLOCK_NAME}-subs"
          placeholder='Click "List subscriptions" below'
          wrap="off"
          disabled
          style="white-space: pre; overflow-x: scroll"></textarea>

        <div id="${BLOCK_NAME}-filters" class="d-flex" style="justify-content:space-between">
          <label><input type="checkbox" value="name" checked/> name</label>
          <label><input type="checkbox" value="link" checked/> link</label>
          <label><input type="checkbox" value="avatar" checked/> avatar</label>
          <label><input type="checkbox" value="subs"/> subs</label>
          <label><input type="checkbox" value="videos"/> videos</label>
        </div>
      </div>

      <button class="d-none" id="${BLOCK_NAME}-subs-copy">copy all</button>
      <button class="d-full" id="listSubsButtonTrigger">List subscriptions</button>

      <span id="logger-output"></span>

    </div>
  `;

  let close = document.createElement("button");
  close.onclick = () => { removeItself() };
  close.style.marginBottom = '.5rem';
  close.textContent = "Close";
  e.append(close);

  document.body.append(e);

  // @twing-include {% include 'building_blocks/shared/partials/logger.js' %}
  logger.init(`#${BLOCK_NAME} #logger-output`);

  const isAtChannelsListPage = () => {
    return document.URL.includes('youtube.com/feed/channels');
  };

  const goToChannelsListPage = () => {
    if (confirm("You are not in the channels page. This will try open 'https://www.youtube.com/feed/channels' in a new tab. Continue?")) {
      logger.log('User redirected to correct page (check if not blocked by browser)');
      window.open('https://www.youtube.com/feed/channels', '_blank', 'noopener,noreferrer');
    }
  };

  const lockInterface = () => {
    // update textarea placeholder
    const textEl = $(`#${BLOCK_NAME}-subs`);
    textEl.value = '';
    textEl.placeholder = 'Parsing content...';
    // disable list button
    $('#listSubsButtonTrigger').disabled = true;
  };
  const releaseInterface = () => {
    // update textarea placeholder
    $(`#${BLOCK_NAME}-subs`).placeholder = 'Content parsed';
    // enable list button
    $('#listSubsButtonTrigger').disabled = false;
  };

  let previousSubsContainer = {};
  const lastParsedSub = {data: {number: 0}, el: ''};
  const subsSelection = new Set();

  const displayContentOnTextarea = (contentSet) => {

    const checkedFilterEls = $$(`#${BLOCK_NAME}-filters input[type="checkbox"]:checked`);
    const filters = [...checkedFilterEls].map((el) => el.value);

    // let multilineOutput = 'name,link,avatar\r\n';
    let multilineOutput = filters.join() + '\r\n';
    contentSet.forEach((item) => {
      filters.forEach((filter, idx) => {
        multilineOutput += `"${item[filter]}"`;
        if (idx !== filters.length - 1) {
          multilineOutput += ',';
        }
      });
      multilineOutput += '\r\n';
    });
    e.querySelector(`#${BLOCK_NAME}-subs`).value = multilineOutput;
    e.querySelector(`#${BLOCK_NAME}-subs-copy`).classList.add('d-full');

    releaseInterface();
  };

  const printResults = () => {
    logger.log('All subscribed channels parsed!');
    const formattedSubsSelectionSet = [...subsSelection].map(item => {
      if (typeof item === 'string') return JSON.parse(item);
      else if (typeof item === 'object') return item;
    });
    displayContentOnTextarea(formattedSubsSelectionSet);
  };

  e.querySelector("#listSubsButtonTrigger").addEventListener('click', () => {

    if (!isAtChannelsListPage()) {
      logger.log('User is not in the expected page');
      goToChannelsListPage();
      return;
    }

    lockInterface();

    const parseSubscriptionRow = () => {

      /**
       * > ytd-item-section-renderer + ytd-continuation-item-renderer
       * > "load more" (scroll ytd-continuation-item-renderer into view)
       * > ytd-continuation-item-renderer vanishes
       * > ytd-item-section-renderer(x2) + ytd-continuation-item-renderer (reappears)
       * > repeat n times
       * > ytd-item-section-renderer(xn) (no ytd-continuation-item-renderer = last page)
       */
      // this element is only visible if there is "load more" channels
      let loadMoreEl = $("ytd-continuation-item-renderer");
      let subsContainer = $$("ytd-item-section-renderer");
      previousSubsContainer = subsContainer;

      if (
        loadMoreEl &&
        previousSubsContainer.length <= subsContainer.length // less or equal would take care of first pass
      ) {
        logger.log('Still loading more sections...');

        loadMoreEl.scrollIntoView();

        setTimeout(() => {
          parseSubscriptionRow();
        }, 3500);

        return;
      }

      logger.log('All sections loaded!');
      parseLoadedSubscriptions();
    };

    const parseLoadedSubscriptions = () => {
      logger.log('Start parsing subscribed channels');

      if (subsSelection.size > 0) {
        logger.log('Subscribed channels already parsed!!!');
        printResults();
        return;
      }

      let subsContainer = $$("ytd-item-section-renderer");
      let lastSubsContainer = subsContainer[subsContainer.length - 1];
      let lastChannelEl = [...$$("ytd-channel-renderer", lastSubsContainer)].at(-1);
      let x = 0;

      for (let container of subsContainer) {
        const channelEls = $$("ytd-channel-renderer", container);

        for (let channelEl of channelEls) {
          x++;
          let elTimeout = setTimeout(() => {
            logger.log('Preloading elements and parsing content');

            const newSub = {};

            // this is required because avatar images are lazy loaded
            // scrollIntoView is called after 500ms
            // this would miss first images from each container
            // but luckly some images are loaded when parseSubscriptionRow() runs
            channelEl.scrollIntoView();

            // #content-section #avatar-section img (src)
            newSub['avatar'] = $("#content-section #avatar-section img", channelEl).src;

            // #content-section #info-section ytd-channel-name .ytd-channel-name (textContent)
            newSub['name'] = $("#content-section #info-section ytd-channel-name #text.ytd-channel-name", channelEl).textContent.trim();

            // #content-section #info-section #main-link (href)
            newSub['link'] = $("#content-section #info-section #main-link", channelEl).href;

            // newSong['subs'];
            newSub['subs'] = $("#content-section #info-section #metadata #subscribers", channelEl).textContent.trim().split(' ')[0];

            // newSong['videos'];
            newSub['videos'] = $("#content-section #info-section #metadata #video-count", channelEl).textContent.trim().split(' ')[0];

            // newSong['notificationStatus'];

            // ensures set does not contains duplicate entries
            subsSelection.add(JSON.stringify(newSub, Object.keys(newSub).sort()));
            lastParsedSub['data'] = newSub;
            lastParsedSub['el'] = channelEl;

            if (lastChannelEl.isEqualNode(channelEl)) {
              printResults();
            }
          }, x * 75); // variable time, depends on user resources (process power + connection speed)

          TIMEOUT_POOL.push(elTimeout);
        }
      }
    };

    logger.log('Loading page sections');
    parseSubscriptionRow();

  });

  e.querySelector(`#${BLOCK_NAME}-subs-copy`).addEventListener('click', () => {
    copyTextareaToClipboard(e.querySelector(`#${BLOCK_NAME}-subs`));
  });

  $$(`#${BLOCK_NAME}-filters input[type="checkbox"]`).forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (subsSelection.size > 0) {
        printResults();
      }
    });
  });
  
  // @twing-include {% include 'building_blocks/shared/partials/move-handler.js' %}

}
