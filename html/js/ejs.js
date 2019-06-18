
/*window.addEventListener("load", () => {
  // If there's no ecmascript 5 support, don't try to initialize
  if (!Object.create || !window.JSON) return
*/
  document.body.addEventListener("click", e => {
    for (let n = e.target; n; n = n.parentNode) {
      if (n.className === "c_ident") return

      if (n.nodeName === "DIV" && n.className === "solution")
        n.className = "solution open"
    }
  })

  let sandboxHint = null
  if (window.chapNum && window.chapNum < 20 && window.localStorage && !localStorage.getItem("usedSandbox")) {

    let pres = document.getElementsByTagName("pre")
    for (let i = 0; i < pres.length; i++) {
      let pre = pres[i]
      if (!/^(text\/)?(javascript|html)$/.test(pre.getAttribute("data-language")) ||
        chapNum == 1 && !/console\.log/.test(pre.textContent)) continue
      sandboxHint = elt("div", {"class": "sandboxhint"}, "edit & run code by clicking it")
      pre.insertBefore(sandboxHint, pre.firstChild)
      break
    }
  }

  CodeMirror.commands[CodeMirror.keyMap.default.Down = "lineDownEscape"] = cm => {
    let cur = cm.getCursor()
    if (cur.line == cm.lastLine()) {
      document.activeElement.blur()
      return CodeMirror.Pass
    } else {
      cm.moveV(1, "line")
    }
  }
  CodeMirror.commands[CodeMirror.keyMap.default.Up = "lineUpEscape"] = cm => {
    let cur = cm.getCursor()
    if (cur.line == cm.firstLine()) {
      document.activeElement.blur()
      return CodeMirror.Pass
    } else {
      cm.moveV(-1, "line")
    }
  }

  let keyMap = {
    Esc(cm) { cm.display.input.blur() },
    "Ctrl-Enter"(cm) { renderCode(cm.state.context) },
    "Cmd-Enter"(cm) { renderCode(cm.state.context) },
    "Ctrl-Down"(cm) { hideEditor(cm.state.context) },
    "Ctrl-Esc"(cm) { resetSandbox(cm.state.context.sandbox) },
    "Cmd-Esc"(cm) { resetSandbox(cm.state.context.sandbox) }
  }

  let nextID = 0
  let article = document.getElementsByTagName("article")[0]

  function activateCode(node, e, lang, cmVisible) {
    if (node.style.display === "none") {
      return
    }
    node.style.display = "none";

    if (sandboxHint) {
      sandboxHint.parentNode.removeChild(sandboxHint)
      sandboxHint = null
      localStorage.setItem("usedSandbox", "true")
    }

    let code = node.textContent
    let wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node)
    let editor = CodeMirror(div => wrap.insertBefore(div, wrap.firstChild), {
      value: code,
      mode: lang,
      extraKeys: keyMap,
      matchBrackets: true,
      lineNumbers: true
    })

    let pollingScroll = null

    function pollScroll() {
      if (document.activeElement != editor.getInputField()) return
      let rect = editor.getWrapperElement().getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) editor.getInputField().blur()
      else pollingScroll = setTimeout(pollScroll, 500)
    }
    editor.on("focus", () => {
      clearTimeout(pollingScroll)
      pollingScroll = setTimeout(pollScroll, 500)
    })

    wrap.style.marginLeft = wrap.style.marginRight = "0px"
    setTimeout(() => editor.refresh(), 600)

    if (e) {
      editor.setCursor(editor.coordsChar({left: e.clientX, top: e.clientY}, "client"))
      editor.focus()
    }

    let out = wrap.appendChild(elt("div", {"class": "sandbox-output"}))
    let sandbox = node.getAttribute("data-sandbox")
    if (lang == "text/html" && !sandbox) {
      sandbox = "html" + nextID++
      node.setAttribute("data-sandbox", sandbox)
      sandboxSnippets[sandbox] = node
    }

    let data = editor.state.context = {editor: editor,
      wrap: wrap,
      orig: node,
      isHTML: lang == "text/html",
      sandbox: sandbox,
      meta: node.getAttribute("data-meta")}

    data.output = new SandBox.Output(out)
    node.dataeditor = data;

    renderCode(data, true);

    let sandboxMenu = wrap.appendChild(elt("div", {"class": "sandbox-menu"}));
    initializeMenu(data, sandboxMenu);

    if (cmVisible === false) {
      hideEditor(data);
    }
  }

  function initializeMenu(data, node) {
    let items = [
      {type: "image",
        src: "img/gray_publish_button.png",
        title: "Render (ctrl/cmd-enter)",
        style: "background: white",
        handler: () => renderCode(data)},
      {type: "image",
        src: "img/gray_reset_button.png",
        title: "Reset (ctrl/cmd-esc)",
        style: "background: white",
        handler: () => resetCode(data)},
      {type: "image",
        src: "img/gray_detach_button.png",
        title: "Detach",
        style: "background: white",
        handler: () => detachEditor(data)},
      {type: "image",
        src: "img/gray_hide_button.png",
        title: "Hide",
        style: "background: white",
        handler: () => hideEditor(data)}
    ];

    items.forEach(item => {
      let elm = node.appendChild(elt("input", item));
      elm.addEventListener('click', item.handler);
    });
  }

  function elt(type, attrs) {
    let firstChild = 1
    let node = document.createElement(type)
    if (attrs && typeof attrs === "object" && attrs.nodeType == null) {
      for (let attr in attrs)
        if (attrs.hasOwnProperty(attr)) {
          if (attr === "css")
            node.style.cssText = attrs[attr]
          else node.setAttribute(attr, attrs[attr])
        }
      firstChild = 2
    }
    for (let i = firstChild; i < arguments.length; ++i) {
      let child = arguments[i]
      if (typeof child === "string")
        child = document.createTextNode(child)
      node.appendChild(child)
    }
    return node
  }

function stringify(text) {
  oldConsoleLog(text);

  let pre = document.createElement('pre');
  let textNode = document.createTextNode(JSON.stringify(text, null, "  "));
  console.output.appendChild(pre);
}

function log(text) {
  oldConsoleLog(text);

  let pre = document.createElement('pre');
  let textNode = document.createTextNode(text);
  pre.appendChild(textNode);
  console.output.appendChild(pre);
}

function error(text) {
  let pre = document.createElement('pre');
  let textNode = document.createTextNode(text);
  pre.appendChild(textNode);
  pre.style.color = "red";
  console.output.appendChild(pre);
}

  window.onerror = function (errorMsg, url, lineNumber) {
    error(lineNumber + ": " + errorMsg);
  }

  var oldConsoleLog = window.console.log;
  window.console.log = log;
  window.console.error = log;
  window.console.stringify = stringify;

  function renderCode(data, onload) {
    data.output.clear()
    let val = data.editor.getValue()
    getSandbox(data.sandbox, data.isHTML, box => {
      console.output = data.output.div;  // rem
      if (data.isHTML)
        box.setHTML(val, data.output, () => {
          if (data.orig.getAttribute("data-focus")) {
            box.win.focus()
            box.win.document.body.focus()
          }
        })
      else
        box.run(val, data.output, data.meta)
    })

    if (!onload) {
      data.wrap.childNodes[2].childNodes[0].blur();
    }
  }

  function resetCode(data) {
    data.editor.setValue(data.orig.textContent)
    data.wrap.childNodes[2].childNodes[1].blur();
    renderCode(data)
  }

  function hideEditor(data) {
    data.wrap.childNodes[2].firstChild.style.visibility = "hidden";
    data.wrap.childNodes[2].childNodes[3].src = "img/gray_show_button.png";
    data.wrap.childNodes[2].childNodes[3].addEventListener('click', () => showEditor(data));
    data.wrap.childNodes[2].childNodes[3].title = "Show editor (ctrl-down)";

    data.wrap.firstChild.style.display = 'none';
    document.body.focus();
  }

  function showEditor(data) {
    data.wrap.childNodes[2].firstChild.style.visibility = "visible";
    data.wrap.childNodes[2].childNodes[3].src = "img/gray_hide_button.png";
    data.wrap.childNodes[2].childNodes[3].addEventListener('click', () => hideEditor(data));
    data.wrap.childNodes[2].childNodes[3].title = "Hide editor";

    let scrollbars = data.wrap.firstChild.getElementsByClassName('CodeMirror-vscrollbar');
    for (let elm of scrollbars) {
      elm.style.top = "22px";
    }

    data.wrap.firstChild.style.display = "block";
    data.editor.refresh();
    data.editor.focus();
  }

  function detachEditor(data) {

    let title = "Using D3.js";
    let windowVariableName = "bla";

    let width = data.wrap.offsetWidth;
    let height = data.wrap.offsetHeight;

    const windowCreationOptionsList = {
      width: width + 100,
      height: 1,
      top: (window.innerHeight - width) / 2 + window.screenY,
      left: (window.innerWidth - height) / 2 + window.screenX,
      location: 'no',
      title: title
    };

    //TODO: hide location bar

    let windowCreationOptions = Object.keys(windowCreationOptionsList)
      .map(
        (key) => key + '=' + windowCreationOptionsList[key]
      )
      .join(',');


    const popupWindow = window.open("modal_sandbox.html", title, windowCreationOptions);
    if (!popupWindow) {
      return null;
    }

    popupWindow.onload = function (event) {
      loadSandbox(popupWindow, data);
    }
  }

  function loadSandbox(popupWindow, data) {
    let document = popupWindow.document;

    document.body.firstChild.remove();

    let article = document.createElement('article');
    document.body.insertBefore(article, document.body.firstChild);

    let node = data.orig.cloneNode(true);
    node.style.display = "block";
    article.appendChild(node);

    // load scripts and styles at beginning of article

    let children = window.document.body.firstChild.childNodes;
    let len = children.length;
    for (let i = 0; i < len; i++) {
      let child = children[i];
      if (child.nodeName === 'SCRIPT') {
        let newNode = document.createElement('script');
        if (child.hasAttribute('src')) {
          newNode.src = child.src;
        }
        else {
          newNode.innerHTML = child.innerHTML;
        }
        article.insertBefore(newNode, article.firstChild);
      }
      else if (child.nodeName === 'STYLE') {
        let newNode = document.createElement('style');
        newNode.innerHTML = child.innerHTML;
        article.insertBefore(newNode, article.firstChild);
      }
    }

    activateCode(node, null, "html", true);
    let sandboxMenu = article.getElementsByClassName('sandbox-menu')[0];

    sandboxMenu.childNodes[2].style.visibility = "hidden";
    sandboxMenu.childNodes[3].style.visibility = "hidden";

    popupWindow.resizeTo(article.offsetWidth + 100, article.offsetHeight + 100);

    popupWindow.modal_sandbox_data = node.dataeditor;
  }

  let sandboxSnippets = {}
  {
    let snippets = document.getElementsByClassName("snippet")
    for (let i = 0; i < snippets.length; i++) {
      let snippet = snippets[i]
      if (snippet.getAttribute("data-language") == "text/html" &&
        snippet.getAttribute("data-sandbox"))
        sandboxSnippets[snippet.getAttribute("data-sandbox")] = snippet
    }
  }

  let sandboxes = {}
  function getSandbox(name, forHTML, callback) {
    name = name || "null"
    if (sandboxes.hasOwnProperty(name)) return callback(sandboxes[name])
    let options = {loadFiles: window.sandboxLoadFiles}, html
    if (sandboxSnippets.hasOwnProperty(name)) {
      let snippet = sandboxSnippets[name]
      options.place = node => placeFrame(node, snippet)
      if (!forHTML) html = snippet.textContent
    }
    SandBox.create(options).then(box => {
      if (html != null)
        box.win.document.documentElement.innerHTML = html
      sandboxes[name] = box
      callback(box)
    })
  }

  function resetSandbox(name) {
    if (!sandboxes.hasOwnProperty(name)) return
    let frame = sandboxes[name].frame
    frame.parentNode.removeChild(frame)
    delete sandboxes[name]
  }

  function placeFrame(frame, snippet) {
    let wrap = snippet.previousSibling, bot
    if (!wrap || wrap.className != "editor-wrap") {
      bot = snippet.getBoundingClientRect().bottom
      activateCode(snippet, null, "text/html")
      wrap = snippet.previousSibling
    } else {
      bot = wrap.getBoundingClientRect().bottom
    }
    wrap.insertBefore(frame, wrap.childNodes[1])
    if (bot < 50) {
      let newBot = wrap.getBoundingClientRect().bottom
      window.scrollBy(0, newBot - bot)
    }
  }

  /* activate and run the code in each pre element */
  let pres = document.getElementsByTagName("pre")
  for (let i = 0; i < pres.length; i++) {
    let pre = pres[i]
    if (!pre.hasAttribute('data-cm'))
      continue;
    let state = pre.getAttribute("data-cm")
    let cmVisible = /^(visible)$/.test(state);
    let lang = pre.getAttribute("data-language")
    activateCode(pre, null, lang, cmVisible);
  }
//})
