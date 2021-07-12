
if (document.querySelector("#block-toggle-css-outline")) {
    let e = document.querySelector("#block-toggle-css-outline");
    e.parentNode.removeChild(e);
    e = null;
} else {
    let e = document.createElement("style");
    e.id = "block-toggle-css-outline";
    e.innerHTML = `
    	* {
    		outline: 1px solid red;
    	}
    `;
    document.head.append(e);
}
