/**
 * @requires /shared/partials/utils.js
 */

let offset = [0, 0];
let moveTriggered = false;

let moveHandler = $("#moveHandler");

if (!moveHandler) {
  moveHandler = create('span');
  fill(moveHandler, 'innerHTML', 'move');
  $(`#${BLOCK_NAME} summary`).appendChild(moveHandler);
}

moveHandler.id = 'moveHandler';
fill(moveHandler, 'style', `
  float: right;
  font-weight: bolder;
  padding: .125rem .5rem;
  margin-top: -.125rem;
  background-color: rgba(0,0,0,.1);
  border-radius: 3px;
  cursor: move;
`);
// fill(moveHandler, 'style.float', 'right');
// fill(moveHandler, 'style.fontWeigth', 'bolder');
// fill(moveHandler, 'style.padding', '.125rem .5rem');
// fill(moveHandler, 'style.marginTop', '-.125rem');
// fill(moveHandler, 'style.backgroundColor', 'rgba(0,0,0,.1)');
// fill(moveHandler, 'style.borderRadius', '3px');
// fill(moveHandler, 'style.cursor', 'move');

fill(moveHandler, 'onmousedown', (ev) => {
  moveTriggered = true;
  ev.preventDefault();

  let e = $(`#${BLOCK_NAME}`);
  const { top, left } = e.getBoundingClientRect();

  offset = [
    left - ev.clientX,
    top - ev.clientY
  ];
});

fill(moveHandler, 'onmouseup', () => {
  moveTriggered = false;
});

// this is useful if moveHandler is not small,
//  otherwise, it falls behind the positioning style update and breaks out of moving
fill(moveHandler, 'onmouseleave', () => {
  moveTriggered = false;
});

fill(moveHandler, 'onmousemove', (ev) => {
  if (!moveTriggered) return;
  ev.preventDefault();

  let e = $(`#${BLOCK_NAME}`);

  // set right to default value, needed for calculations
  // (otherwise element stretch from 0-right to the new position)
  e.style.right = 'auto';

  e.style.left = Number(ev.clientX + offset[0]) + 'px';
  e.style.top  = Number(ev.clientY + offset[1]) + 'px';
});
