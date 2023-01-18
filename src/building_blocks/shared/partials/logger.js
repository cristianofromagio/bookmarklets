/**
 * @requires /shared/partials/utils.js
 */

let LOGGER_ELEMENT;
const LOGGER_LAST_MESSAGE = { hits: 0, data: ''};

const logger = {
  log: (message) => {
    if (!LOGGER_ELEMENT) {
      console.log(message);
      return;
    }

    let entry;
    let dg = '2-digit';
    let time = new Date().toLocaleTimeString(undefined, {hour: dg, minute: dg, second: dg, hour12: false});

    if (LOGGER_LAST_MESSAGE.data === message) {
      let hits = LOGGER_LAST_MESSAGE.hits + 1;
      LOGGER_LAST_MESSAGE.hits = hits;
      // entry = [...$$('p', LOGGER_ELEMENT)].at(-1); // last child
      entry = [...$$('p', LOGGER_ELEMENT)].at(0); // first child
      entry.textContent = `[${time}] (${hits}) ${message}`;
      return;
    }

    LOGGER_LAST_MESSAGE.hits = 1;
    LOGGER_LAST_MESSAGE.data = message;

    entry = create('p');
    entry.textContent = `[${time}] ${message}`;
    // LOGGER_ELEMENT.appendChild(entry); // last child
    LOGGER_ELEMENT.insertAdjacentElement('afterbegin', entry); // first child
  },
  init: (queryParent = null) => {
    if (!queryParent) {
      return;
    }
    LOGGER_ELEMENT = create('details');
    LOGGER_ELEMENT.id = 'LOGGER_UTILS';
    let summ = create('summary');
    summ.textContent = 'Activity logs:';
    LOGGER_ELEMENT.appendChild(summ);

    const el = $(queryParent);
    el.appendChild(LOGGER_ELEMENT);

    const styles = create('style');
    styles.textContent = `
      #LOGGER_UTILS {
        text-align: left;
        max-height: 250px;
        width: 100%;
        padding: 5px;
        overflow-y: scroll;
      }
      #LOGGER_UTILS * {
        font-family: monospace;
        font-size: 12px;
      }
    `;
    LOGGER_ELEMENT.insertAdjacentElement('beforebegin', styles);
  }
};

