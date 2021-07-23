/**
 * refs:
 * 	- https://help.archive.org/hc/en-us/articles/360001513491-Save-Pages-in-the-Wayback-Machine
 *  - https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine#JavaScript_bookmarklet
 */ 

location.href='https://web.archive.org/web/*/'+document.location.href.replace(/\/$/, '');
