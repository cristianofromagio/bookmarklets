
/**
 * 2021-08-17 - video visibilitychange event listeners
 * 		<--> window
 * 		<--> document 980:619 consumerLib
 * 		<--> document d42:1078 consumer
 * 		document 980:235 consumerLib
 * 		document 980:221 consumerLib
 * 		document 8b7:19 consumerUi
 * 		document d42:3 consumerLib
 * 
 * refs:
 *  - https://stackoverflow.com/a/64609983
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
 */

if (document.querySelector("#block-toggle-video-autostop-element")) {
    let e = document.querySelector("#block-toggle-video-autostop-element");
    e.parentNode.removeChild(e);
    e = null;
    location.reload(true);
} else {
	if (document.querySelector("video")) {

		let hidden, visibilityChange;
		if (typeof document.hidden !== "undefined") {
		  hidden = "hidden";
		  visibilityChange = "visibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
		  hidden = "msHidden";
		  visibilityChange = "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
		  hidden = "webkitHidden";
		  visibilityChange = "webkitvisibilitychange";
		}

        let v = document.querySelector("video");

        function handleVisibilityChange() {
		  if (document[hidden]) {
		    v.play();
		    v.muted = false;
		    v.loop = true;
		  }
		}

		if (typeof document.addEventListener === "undefined" || hidden === undefined) {
		  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
		} else {
		  document.addEventListener(visibilityChange, handleVisibilityChange, false);
		}

        let e = document.createElement("div");
	    e.id = "block-toggle-video-autostop-element";
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
	    e.innerHTML = "Prevent autostop: ON";
	    document.body.append(e);
    } else {
    	alert("Video element not found!");
    }
}
