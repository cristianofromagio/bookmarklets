// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
function toSvgString(qrGen, border, lightColor, darkColor) {
  if (border < 0)
    throw new RangeError("Border must be non-negative");
  let parts = [];
  for (let y = 0; y < qrGen.size; y++) {
    for (let x = 0; x < qrGen.size; x++) {
      if (qrGen.getModule(x, y))
        parts.push(`M${x + border},${y + border}h1v1h-1z`);
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qrGen.size + border * 2} ${qrGen.size + border * 2}" stroke="none">
    <rect width="100%" height="100%" fill="${lightColor}"/>
    <path d="${parts.join(" ")}" fill="${darkColor}"/>
    </svg>
  `;
}

const svgEl = document.querySelector("/* @twing-start{{ svgSelector }}@twing-end */");

const qrGen = qrcodegen.QrCode.encodeSegments(
  qrcodegen.QrSegment.makeSegments(/* @twing-start{{ contentVariable }}@twing-end */),
  qrcodegen.QrCode.Ecc.MEDIUM,
  parseInt(1, 10),
  parseInt(40, 10),
  parseInt(-1, 10),
  true
);

const border = parseInt(0, 10);
const lightColor = "#FFFFFF";
const darkColor = "#000000";
const code = toSvgString(qrGen, border, lightColor, darkColor);

const viewBox = (/ viewBox="([^"]*)"/.exec(code))[1];
const pathD = (/ d="([^"]*)"/.exec(code))[1];
svgEl.setAttribute("viewBox", viewBox);
svgEl.querySelector("path").setAttribute("d", pathD);
svgEl.querySelector("rect").setAttribute("fill", lightColor);
svgEl.querySelector("path").setAttribute("fill", darkColor);