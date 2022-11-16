
javascript:(function() {

  const BLOCK_NAME = "headless-page-element-vanish-/* @twing-start{{ hash }}@twing-end */";

  const undoItself = () => {

    document.body.classList.remove("has-"+ BLOCK_NAME);

    document.querySelectorAll("."+BLOCK_NAME+"-vanished-element").forEach((el) => {
      el.classList.remove(BLOCK_NAME+"-vanished-element");
    });

    document.querySelectorAll("./* @twing-start{{ canonicalBlockName }}@twing-end */-vanished-element").forEach((el) => {
      el.classList.remove("/* @twing-start{{ canonicalBlockName }}@twing-end */-vanished-element");
    });

    let sheet = document.querySelector("#"+BLOCK_NAME+"-stylesheet");
    if (sheet) {
      sheet.parentNode.removeChild(sheet);
      sheet = null;
    }

  };

  /* check if toggled or if vanished by canonical bookmarklet */
  if (
    document.body.classList.contains("has-"+ BLOCK_NAME) ||
    document.querySelector("./* @twing-start{{ canonicalBlockName }}@twing-end */-vanished-element")
  ) {
    undoItself();
  } else {

    document.body.classList.add("has-"+ BLOCK_NAME);

    if (!document.querySelector("#"+BLOCK_NAME+"-stylesheet")) {
      let vanishStylesheet = document.createElement("style");
      vanishStylesheet.id = BLOCK_NAME+"-stylesheet";
      vanishStylesheet.innerHTML = "."+BLOCK_NAME+"-vanished-element {visibility: hidden;opacity: 0;height: 0;}";
      document.head.append(vanishStylesheet);
    }

    let selector = comparingText = comparingValue = parsedConfigs = '';

    try {
      const configContent = Object.entries(JSON.parse(JSON.stringify(/* @twing-start{{ configInput }}@twing-end */)));
      parsedConfigs = new Map(configContent);
    } catch (err) {
      console.log('ERROR: couldnt parse configs');
      console.log(err);
    }

    if (parsedConfigs) {
      selector = parsedConfigs.get("elementsSelector");
      comparingText = parsedConfigs.get("textSelector");
      comparingValue = parsedConfigs.get("compare");
    }

    if (!selector || !comparingText || !comparingValue) {
      console.log('INFO: required values not provided');
      return;
    }

    try {

      const selectorAll = document.querySelectorAll(selector);

      if (selector.length === 0) {
        console.log('INFO: no blocks found with selector');
        return;
      }

      let comparingValueText = comparingValue.toLowerCase();
      const isNegation = (comparingValueText[0] === "~") ? true : false;

      selectorAll.forEach((el) => {
        const textBlock = el.querySelector(comparingText);
        if (!textBlock) { return }

        const textContent = textBlock.textContent;
        const textContentLower = textContent.trim().toLowerCase();

        if (isNegation) {
          let comparingValueTextWithoutNegation = comparingValueText.substring(1);
          if (textContentLower.includes(comparingValueTextWithoutNegation)) {
            el.classList.add(BLOCK_NAME+"-vanished-element");
          }
        } else {
          if (!textContentLower.includes(comparingValueText)) {
            el.classList.add(BLOCK_NAME+"-vanished-element");
          }
        }
      });
    } catch(err) {
      console.log('ERROR: couldnt execute vanisher');
      console.log(err);
    }

  }
})();
