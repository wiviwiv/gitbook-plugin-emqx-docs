require(['gitbook', 'jQuery'], function(gitbook, $) {

  function $docsChangeLang(lang) {
    lang = lang || 'zh'
    var href = location.href
    if (!['zh', 'en'].includes(lang) || href.includes('/' + lang)) {
      return
    }
    location.href = href.replace(/\/zh|\/en/, '/' + lang)
  }

  function insertBlock() {

    var doc = document.querySelector('#book-search-input input')
    if (doc && doc.placeholder === '輸入並搜尋') {
      doc.placeholder = '请输入并搜索'
    }

    // 获取 gitbook 配置
    var config = gitbook.state.config.pluginsConfig['emqx-docs']
    var version = ['3.0']

    var lang = /\/zh/.test(location.href) ? 'zh' : 'en'
    var langeLabel = lang === 'zh' ? '语言' : 'Language'

    // 插入版本切换
    function insertToggleElement() {
      var gitLink = document.querySelector('.gitbook-link')
      gitLink && gitLink.parentElement && gitLink.parentElement.remove()
      var html =
          `<div id="version-toggle">
              ${ lang === 'zh' ? '版本' : 'Version' }
              <select>
                ${version.map($ => {
            return '<option value="' + $ + '">' + $ + '</option>'
          }).join(' ')}
              </select>
          </div>
          <div id="language-toggle">
            ${langeLabel}
            <select id="language-change">
              <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
              <option value="zh" ${lang === 'zh' ? 'selected' : ''}>中文</option>
            </select>
          </div>`

      var summary = document.querySelector('.summary')
      var li = document.createElement('li')
      var divider = document.querySelector('.summary li.divider')
      if (divider) {
        divider.remove()
      }
      li.className = 'version--wrapper'
      li.innerHTML = html
      summary.appendChild(li)

      $('#language-change').change(function() {
        lang = $('#language-change option:selected').val()
        if (!['zh', 'en'].includes(lang) || location.href.includes('/' + lang)) {
          return
        }
        location.href = location.href.replace(/\/zh|\/en/, '/' + lang)
      })
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
        insertToggleElement()
      }
    }, 10)
  }

  gitbook.events.bind('page.change', function() {
    insertBlock()
  })
})
