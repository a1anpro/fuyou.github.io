(() => {
    const log = console.log.bind(console)
    const e = (selector) => document.querySelector(selector)

    const templateCell = (href, title) => {
        const div = document.createElement('div')
        const a = document.createElement('a')
        a.setAttribute('href', href)
        a.setAttribute('class', 'menu-name')
        a.innerHTML = title
        div.appendChild(a)
        return div
    }

    const getRoot = () => {
        const path = window.document.location.href
        const hs = path.split('/')
        const root = hs.slice(0, hs.indexOf('fuyoucpu') + 1).join('/')
        return root
    }

    const templateNav = () => {
        const nav = document.createElement('div')
        nav.setAttribute('class', 'float-nav')
        const root = getRoot()

        const config = [
            {
                href: `${root}/cpu/index.html`,
                title: 'ASM IDE',
            },
            {
                href: `${root}/domMinesweeper/index.html`,
                title: 'Dom扫雷',
            },
            {
                href: `${root}/canvasMinesweeper/index.html`,
                title: 'Canvas扫雷',
            },
        ]
        log('config:', config)
        const map = config.map(item => templateCell(item.href, item.title))
        map.forEach(item => nav.appendChild(item))
        e('body').appendChild(nav)

    }

    const loadStyle = () => {
        const root = getRoot()
        const style = document.createElement("link");
        style.setAttribute('href', `${root}/index.css`)
        style.setAttribute('rel', 'stylesheet')
        console.log('style:', style)
        e('body').appendChild(style)
        // <link href="index.css" rel="stylesheet">
    }

    const _load_common = () => {
        loadStyle()
        console.log('load common', window.document.location.href)
        templateNav()
    }

    _load_common()
})(this)