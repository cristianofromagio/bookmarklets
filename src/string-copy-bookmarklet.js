
/**
 * refs:
 *  -
 */

// const BLOCK_NAME = "string-copy-bookmarklet";

const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    console.log('string coppied!');
};

copyToClipboard("$PLACEHOLDER$");