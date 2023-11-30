const getSelectedText = () => {
    if (document.activeElement.tagName.toLowerCase() == 'textarea') {
        var curElem = document.activeElement;
        return curElem.value.substring(curElem.selectionStart, curElem.selectionEnd);
    } else if (window.getSelection) {
        return window.getSelection().toString();
    } else {
        return false;
    }
}