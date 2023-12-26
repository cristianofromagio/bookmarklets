/**
 * @requires /shared/partials/utils.js
 */

try {
  if (PARTIAL_UTILS);
} catch (e) {
  alert("Requires utils.js");
}

let offset = [0, 0];
let moveTriggered = false;

let moveHandler = $("#moveHandler");
let mouseMoveListener;

if (!moveHandler) {
  moveHandler = create('span');
  fill(moveHandler, 'textContent', 'move');
  let summaryEl = $(`#${BLOCK_NAME} summary`);
  if (summaryEl) {
    summaryEl.appendChild(moveHandler);
  } else {
    $(`#${BLOCK_NAME}`).appendChild(moveHandler);
  }
}

moveHandler.id = 'moveHandler';
fill(moveHandler, 'style', `
  position: absolute;
  top: .375em;
  right: .375em;
  font-weight: bolder;
  padding: .125em .5em;
  background-color: rgba(0,0,0,.2);
  text-shadow: 1px 1px 1px rgba(0,0,0,.5);
  border-radius: 3px;
  cursor: move;
  color: #fff;
  font-size: 12px;
  font-family: sans-serif;
  box-sizing: border-box;
`);

fill(moveHandler, 'onclick', (ev) => {
  ev.preventDefault();
  ev.stopImmediatePropagation();
});

fill(moveHandler, 'onmousedown', (ev) => {
  moveTriggered = true;
  ev.preventDefault();

  let e = $(`#${BLOCK_NAME}`);
  const { top, left } = e.getBoundingClientRect();

  offset = [
    left - ev.clientX,
    top - ev.clientY
  ];

  document.addEventListener('mousemove', handleMouseMove);
});

fill(moveHandler, 'onmouseup', (ev) => {
  moveTriggered = false;
  ev.preventDefault();

  document.removeEventListener('mousemove', handleMouseMove);
});

// THIS IS MADE USELESS ONCE WE LISTEN TO THE DOCUMENT 'onMouseMove'
// // this is useful if moveHandler is not small,
// //  otherwise, it falls behind the positioning style update and breaks out of moving
// fill(moveHandler, 'onmouseleave', () => {
//   console.log('mouseleave');
//   if (!moveTriggered) {
//     moveTriggered = false;
//   }
// });

const handleMouseMove = (ev) => {
  if (!moveTriggered) return;
  ev.preventDefault();

  let e = $(`#${BLOCK_NAME}`);

  // set other values to default, needed for calculations
  // (otherwise element stretch from 0-right to the new position)
  e.style.right = 'auto';
  e.style.bottom = 'auto';

  e.style.left = Number(ev.clientX + offset[0]) + 'px';
  e.style.top  = Number(ev.clientY + offset[1]) + 'px';
};
