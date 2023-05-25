
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
      vanishStylesheet.innerHTML = "."+BLOCK_NAME+"-vanished-element {visibility: hidden;opacity: 0;height: 0;} ."+BLOCK_NAME+"-vanished-element--purged {display: none !important;}";
      document.head.append(vanishStylesheet);
    }

    // SCRIPT CORE SHARED SETUP
    // cant 'multi-declare' then in one line because minifier goes crazy
    let selector = '';
    let comparingTextBlock = '';
    let comparingTextBlockAttr = '';
    let comparingValue = '';
    let parsedConfigs = '';

    try {
      // SCRIPT CORE SHARED SETUP MODIFIED
      const configContent = Object.entries(JSON.parse(JSON.stringify(/* @twing-start{{ configInput }}@twing-end */)));
      // SCRIPT CORE SHARED SETUP MODIFIED - END
      parsedConfigs = new Map(configContent);
    } catch (err) {
      console.log('ERROR: couldnt parse configs');
      console.log(err);
      return;
    }

    if (parsedConfigs) {
      selector = parsedConfigs.get("elementsSelector");
      comparingTextBlock = parsedConfigs.get("textSelector");
      comparingTextBlockAttr = parsedConfigs.get("textSelectorAttr");
      comparingValue = parsedConfigs.get("compare");
    }

    if (!selector || !comparingTextBlock || !comparingTextBlockAttr || !comparingValue) {
      console.log('INFO: required values not provided');
      return;
    }
    // SCRIPT CORE SHARED SETUP - END

    // SCRIPT CORE SHARED RUN
    try {

      const selectorAll = document.querySelectorAll(selector);

      if (selector.length === 0) {
        console.log('INFO: no blocks found with selector');
        return;
      }

      let comparingValueText = comparingValue.toLowerCase();
      const isNegation = (comparingValueText[0] === "~") ? true : false;

      selectorAll.forEach((el) => {
        // window.Polymer tries to query for Polymer-based webcomponents (specifically target YouTube interface)
        let comparingElementBlock = el.querySelector(comparingTextBlock) || window.Polymer.dom(el).shadowRoot.querySelector(comparingTextBlock);
        if (!comparingElementBlock) {
          console.log("Can't find any 'comparingTextBlock' blocks inside the elementSelector");
          return;
        }

        const comparingContent = comparingElementBlock[comparingTextBlockAttr];
        if (!comparingContent) {
          console.log("Can't find any 'comparingTextBlockAttr' attributes on the comparingElementBlock");
          return;
        }
        const comparingContentLower = comparingContent.trim().toLowerCase();

        // SCRIPT CORE SHARED RUN MODIFIED
        // (VANISH+PURGE AT SAME TIME)
        let vanishClass = BLOCK_NAME+"-vanished-element";
        if (isNegation) {
          // removes ~ symbol
          let comparingValueTextWithoutNegation = comparingValueText.substring(1);
          if (comparingContentLower.includes(comparingValueTextWithoutNegation)) {
            el.classList.add(vanishClass);
            el.classList.add(vanishClass+"--purged");
          }
        } else {
          if (!comparingContentLower.includes(comparingValueText)) {
            el.classList.add(vanishClass);
            el.classList.add(vanishClass+"--purged");
          }
        }
        // SCRIPT CORE SHARED RUN MODIFIED - END
      });
    } catch(err) {
      console.log('ERROR: couldnt execute vanisher');
      console.log(err);
    }
    // SCRIPT CORE SHARED RUN - END
  }
})();
