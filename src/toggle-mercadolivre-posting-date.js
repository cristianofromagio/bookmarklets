
/**
 * refs:
 *  -
 * limitations:
 *  -
 */

// @twing-include {% include 'building_blocks/shared/partials/utils.js' %}

const BLOCK_NAME = "toggle-mercadolivre-posting-date";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
  window.blockFn[BLOCK_NAME] = null;
  delete window.blockFn[BLOCK_NAME];
};

if (document.querySelector("#" + BLOCK_NAME)) {
  blockFn[BLOCK_NAME].removeItself();
} else {

  if (!window.blockFn) {
    window.blockFn = {};
  }
  window.blockFn[BLOCK_NAME] = {};
  window.blockFn[BLOCK_NAME].removeItself = removeItself;

  let mainPostElement = document.querySelector("#ui-pdp-main-container");

  let preloadedData = window[ "__PRELOADED_STATE__"];
  let postingDateValue = nestedValue(preloadedData, 'initialState.components.track.gtm_event.startTime');

  if (mainPostElement && postingDateValue) {
    let postingDateElement = document.createElement('span');
    postingDateElement.id = BLOCK_NAME;
    fill(postingDateElement.style,
      ['position', 'fontSize', 'fontFamily', 'marginLeft'],
      ['absolute', '11px', 'sans-serif', '5px']
    );

    let formattedDateValue = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date(postingDateValue));
    postingDateElement.textContent = `Postado em: ${formattedDateValue}`;

    mainPostElement.insertAdjacentElement('beforebegin', postingDateElement);
  }
}
