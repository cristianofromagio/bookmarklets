/**
 * refs:
 *  - https://stackoverflow.com/a/37134718
 */

// Gets file extension from URL, or return false if there's no extension
function getExtension(url) {
	let extStart = url.indexOf('.', url.lastIndexOf('/') + 1);
	if (extStart == -1) throw "Url extension not found";
	let ext = url.substr(extStart + 1), extEnd = ext.search(/$|[?#]/);
	return ext.substring (0, extEnd);
}

let currentStory = document.querySelector("#react-root > section > div > div > div:nth-child(5) > section > div > div > div > div").firstElementChild;

let nextBtn = document.querySelector('button div.coreSpriteRightChevron').parentElement;
let headerDivWrapper = nextBtn.parentElement;
let currentAvatar = headerDivWrapper.querySelector("img[data-testid='user-avatar']");

try {
    !function(url, avatar, filename = "story") {
    	let profile = avatar.alt.split(" ").pop();
        filename = filename + '-' + profile + '.' + getExtension(url);
        fetch(url, {
            headers: new Headers({
                Origin: location.origin
            }),
            mode: "cors"
        })
        .then(image => (console.log(image), image.blob()))
        .then(blob => {
            let generated = window.URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.download = filename;
            link.href = generated;
            link.click();
            link.remove();
        })
        .catch(err => console.error(err))
    }((currentStory instanceof HTMLImageElement) ? currentStory.src : '', currentAvatar)
} catch (err) {
    alert("Download failed. " + err);
    console.log("Download failed.", err);
}

