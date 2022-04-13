/**
 * refs:
 *  - https://github.com/sindresorhus/github-markdown-css
 *  - https://stackoverflow.com/q/44286915 
 */

 if (document.querySelector("#block-toggle-gfm-css-style")) {
    let toRemove = [
        "#block-toggle-gfm-css-style",
        "#block-toggle-css-theme",
        "#block-markdown-body-default-style"
    ];

    for (let i = toRemove.length; i--;) {
        let e = document.querySelector(toRemove[i]);
        e.parentNode.removeChild(e);
        e = null;
    }

    window.toggleTheme = undefined;

    document.body.classList.remove("markdown-body");
} else {
    let themes = {
        auto: 'https://unpkg.com/github-markdown-css@latest/github-markdown.css',
        light: 'https://unpkg.com/github-markdown-css@latest/github-markdown-light.css',
        dark: 'https://unpkg.com/github-markdown-css@latest/github-markdown-dark.css'
    };
    let extCss = document.createElement("link");
    extCss.id = "block-toggle-gfm-css-style";
    extCss.rel = "stylesheet";
    extCss.type = "text/css";
    extCss.href = themes.light;
    document.head.append(extCss);
    
    let mdDef = document.createElement("style");
    mdDef.id = "block-markdown-body-default-style";
    mdDef.innerHTML = `
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            transition: all .2s ease;
        }
        
        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }
    `;
    document.head.append(mdDef);

    let e = document.createElement("div");
    e.id = "block-toggle-css-theme";
    e.style.display = "block";
    e.style.padding = "10px 15px";
    e.style.fontFamily = "sans-serif";
    e.style.position = "fixed";
    e.style.fontSize = ".985rem";
    e.style.zIndex = "9999";
    e.style.right = "0px";
    e.style.top = "0px";
    e.style.borderBottomLeftRadius = "5px";
    e.style.backgroundColor = "rgba(27, 32, 50, .5)";
    e.style.margin = "0px";
    e.style.color = "white";
    e.style.textAlign = "center";
    e.innerHTML = `
        <span>Theme:</span>
        <button id="toggle-theme-light" onclick="toggleTheme('light')">Light</button>
        <button id="toggle-theme-dark" onclick="toggleTheme('dark')">Dark</button>
        <button id="toggle-theme-auto" onclick="toggleTheme('auto')">System (auto)</button>
    `;
    document.body.append(e);

    window.toggleTheme = function(pickedTheme) {
        let extCss = document.querySelector("#block-toggle-gfm-css-style");
        extCss.href = themes[pickedTheme];
    }

    /* required by `github-markdown-css` package */
    if (!document.body.classList.contains("markdown-body"))
        document.body.classList.add("markdown-body");
}
