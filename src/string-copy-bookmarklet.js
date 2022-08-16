
/**
 * refs:
 *  -
 */

// const BLOCK_NAME = "string-copy-bookmarklet";

const el = document.createElement('textarea');
el.id = 'id_'+(new Date).getMilliseconds();
el.value = "PLACEHOLDER";
el.setAttribute('readonly', '');
el.style.position = 'absolute';
el.style.left = '-9999px';
document.body.appendChild(el);
el.select();
document.execCommand('copy');
document.body.removeChild(el);
console.log('string copied!');
