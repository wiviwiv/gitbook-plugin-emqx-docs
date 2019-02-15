require(['gitbook', 'jQuery'], function (gitbook, $) {



  function $docsChangeLang(lang) {
    lang = lang || 'zh'
    var href = location.href
    if (!['zh', 'en'].includes(lang) || href.includes('/' + lang)) {
      return
    }
    location.href = href.replace(/\/zh|\/en/, '/' + lang)
  }

  function insertBlock() {
    // 获取 gitbook 配置
    var config = gitbook.state.config.pluginsConfig['emqx-docs']
    var version = ['3.0']

    // 插入版本切换
    function insertVersionChange() {
      var gitLink = document.querySelector('.gitbook-link')
      gitLink && gitLink.parentElement && gitLink.parentElement.remove()
      var html =
        `<div id="version-toggle">
    Version
    <select onchange="versionChange">
      ${version.map($ => {
        return '<option value="'+ $ + '">' + $ + '</option>'
      }).join(' ')}
    </select>
  </div>`
      var summary = document.querySelector('.summary')
      var li = document.createElement('li')
      li.innerHTML = html
      summary.appendChild(li)
    }

    function insertI18N() {
      var lang = /\/zh/.test(location.href) ? 'zh' : 'en'
      var parentElm = document.querySelector('.body-inner .book-header')
      var lastElm = document.querySelector('.body-inner .book-header .font-settings')
      var i18n = document.createElement('div')
      i18n.className = 'btn pull-left'
      var newLang = lang === 'en' ? 'zh' : 'en'
      i18n.innerHTML = newLang.toUpperCase()
      i18n.onclick = function toggleI18n() {
        $docsChangeLang(newLang)
      }
      parentElm.insertBefore(i18n, lastElm)
      lastElm.remove()
    }

    setTimeout(() => {
      if (config.version) {
        insertVersionChange()
      }
      if (config.i18n) {
        insertI18N()
      }
    }, 10);
  }


  gitbook.events.bind('page.change', function () {
    insertBlock()
  })
})