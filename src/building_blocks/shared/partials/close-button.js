let close = document.createElement("button");
close.onclick = () => { removeItself() };
close.innerHTML = "Close";
e.append(close);