
/**
 * refs:
 *  - https://hiddedevries.nl/en/blog/2019-01-30-console-logging-the-focused-element-as-it-changes
 *  - https://stackoverflow.com/a/20959837 (removeEventListener with named function expression)
 *  - browser-sync element style
 */

if (document.querySelector("#block-toggle-focused-element")) {
    let e = document.querySelector("#block-toggle-focused-element");
    e.parentNode.removeChild(e);
    e = null;
} else {
    let e = document.createElement("div");
    e.id = "block-toggle-focused-element";
    e.style.display = "block";
    e.style.padding = "10px 15px";
    e.style.fontFamily = "sans-serif";
    e.style.position = "fixed";
    e.style.fontSize = ".985rem";
    e.style.zIndex = "9999";
    e.style.right = "0px";
    e.style.top = "0px";
    e.style.borderBottomLeftRadius = "5px";
    e.style.backgroundColor = "rgba(27, 32, 50, .5)";
    e.style.margin = "0px";
    e.style.color = "white";
    e.style.textAlign = "center";
    e.style.pointerEvents = "none";
    e.innerHTML = "-";
    document.body.append(e);
    
    document.addEventListener('focus', function abc() {
        let target = document.activeElement;
        let display = "";
        display += target.tagName.toLowerCase();
        if (target.id) display += " #"+target.id;
        if (target.className) display += " ."+target.className;
        if (document.querySelector("#block-toggle-focused-element")) {
            document.getElementById("block-toggle-focused-element").innerHTML = display;
        } else {
            document.removeEventListener('focus', abc, true);
        }
    }, true);
}
