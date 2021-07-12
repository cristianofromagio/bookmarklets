/**
 * refs:
 *  - https://gist.github.com/csswizardry/ad11c8dc6e1bc20dd602312196974de6 
 */

if (document.querySelector("#block-toggle-dom-depth-visualizer")) {
    let e = document.querySelector("#block-toggle-dom-depth-visualizer");
    e.parentNode.removeChild(e);
    e = null;
} else {
    let e = document.createElement("style");
    e.id = "block-toggle-dom-depth-visualizer";
    e.innerHTML = `
    	/**
         * Tier 1 – Dotted
         */
        * { outline: 2px dotted purple; }
        * * { outline: 2px dotted blue; }
        * * * { outline: 2px dotted green; }
        * * * * { outline: 2px dotted yellow; }
        * * * * * { outline: 2px dotted orange; }
        * * * * * * { outline: 2px dotted red; }

        /**
         * Tier 2 – Dashed
         */
        * * * * * * * { outline: 2px dashed purple; }
        * * * * * * * * { outline: 2px dashed blue; }
        * * * * * * * * * { outline: 2px dashed green; }
        * * * * * * * * * * { outline: 2px dashed yellow; }
        * * * * * * * * * * * { outline: 2px dashed orange; }
        * * * * * * * * * * * * { outline: 2px dashed red; }

        /**
         * Tier 3 – Solid
         */
        * * * * * * * * * * * * * { outline: 2px solid purple; }
        * * * * * * * * * * * * * * { outline: 2px solid blue; }
        * * * * * * * * * * * * * * * { outline: 2px solid green; }
        * * * * * * * * * * * * * * * * { outline: 2px solid yellow; }
        * * * * * * * * * * * * * * * * * { outline: 2px solid orange; }
        * * * * * * * * * * * * * * * * * * { outline: 2px solid red; }

        /**
         * Tier z-index: 999999999999 !important; – Heavy
         */
        * * * * * * * * * * * * * * * * * * * { outline: 10px solid red; }
    `;
    document.head.append(e);
}
