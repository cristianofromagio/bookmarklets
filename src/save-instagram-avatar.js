/**
 * refs:
 *  - https://gist.github.com/sfrdmn/8834747
 *  - https://gist.github.com/lucidBrot/432d2c6184a188a060e58dbb36bd2084
 */

let avatar = document.querySelector("img[data-testid='user-avatar']");

try {
    !function(url, filename = "avatar.jpg") {
        filename || (filename = url.split("\\").pop().split("/").pop());
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
    }(avatar.src)
} catch (err) {
    alert("Download failed.");
    console.log("Download failed.", err);
}
