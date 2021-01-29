const es = selector => document.querySelectorAll(selector)
const e = selector => document.querySelector(selector)
const getId = id => document.getElementById(id)

const log = console.log.bind(console)

const templateCell = function (line, x, status) {
    let output = []
    for (let i = 0; i < line.length; i += 1) {
        const cell = document.createElement('div')
        cell.setAttribute('class', `cell ${status}`)
        cell.setAttribute('data-number', line[i])
        cell.setAttribute('data-x', x + 1)
        cell.setAttribute('data-y', i + 1)
        if (line[i] === 9) {
            cell.innerText = '💣'
        } else {
            cell.innerText = line[i]
        }
        output.push(cell)
    }
    return output
}

const templateRow = function (square, status) {
    log('状态:', status)
    const rows = []
    // 生成row
    for (let i = 0; i < square.length; i += 1) {
        const line = square[i]
        const cells = templateCell(line, i, status)
        const row = document.createElement('div')
        row.setAttribute('class', 'row clearfix')
        for (let j = 0; j < cells.length; j += 1) {
            row.appendChild(cells[j])
        }
        rows.push(row)
    }
    return rows
}

const renderSquare = function (square, status) {
    if (status === 'opened') {
        const rows = templateRow(square, status)
        const container = e('#test-wrapper')
        rows.forEach(row => container.appendChild(row))
    } else {
        const rows = templateRow(square, status)
        const container = e('#game-wrapper')
        rows.forEach(row => container.appendChild(row))
        return rows
    }
}

const openCell = (target) => {
    target.classList.remove('closed')
    target.classList.add('opened')
}

const bindEventDelegate = function (square) {
    const cells = es('.cell')
    log(cells.length)
    cells.forEach(cell => cell.addEventListener('click', (event) => {
        const target = event.target
        const dataset = target.dataset
        const {number, x, y} = dataset
        // log(target, number, x, y)
        // 打开元素，就是修改属性
        vjkl(target, square)
    }))
}

const vjkl = function (cell, square) {
    // 因为地图是固定的
    // 传入square主要是来判断周围情况的
    const dataset = cell.dataset
    let {number, x, y} = dataset
    number = parseInt(number)
    if (number === 9) {
        log('游戏结束')
        // 全翻开
        gameOver(square)
    } else if (number === 0) {
        // 翻开空白
        vjklAround(square, x, y)
    } else {
        log('展开自己')
        vjkl1(square, x, y)
    }
}

const gameOver = (square) => {
    for (let i = 1; i < square.length + 1; i += 1) {
        for (let j = 1; j < square.length + 1; j += 1) {
            vjkl1(square, i, j)
        }
    }
}

const vjklAround = function (square, x, y) {
    x = parseInt(x)
    y = parseInt(y)

    // 展开自己
    vjkl1(square, x, y)
    // [[-1, 0], [-1, -1], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    const direction = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    // 展开周围的为0的
    direction.forEach(d => {
        const newX = x + d[0]
        const newY = y + d[1]
        if (newX >= 1 && newY >= 1 && newX <= 9 && newY <= 9) {

            const cell = getCell(square, newX, newY)
            log(newX, newY)
            let {number} = cell.dataset
            number = parseInt(number)
            if (number === 0) {
                // 如果周围仍然是0，则继续展开
                vjkl1(square, newX, newY)
            }
        }
    })
}

const getCell = (square, x, y) => {
    const row = square[x - 1]
    return row.children[y - 1]
}

const vjkl1 = function (square, x, y) {
    log('vjkl1:', x, y)
    if (x <= 9 && y <= 9) {
        const cell = getCell(square, x, y)
        // 如果打开过，就不管了
        if (cell.classList.contains('closed')) {
            let {number} = cell.dataset
            number = parseInt(number)
            if (number === 0) {
                openCell(cell)
                vjklAround(square, x, y)
            } else {
                openCell(cell)
            }
        }
    }
}

const genMap = (square) => {
    // 遍历square所有元素，如果是地雷，则加周围的数字
    const direction = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

    const len = square.length
    for (let i = 0; i < len; i += 1) {
        for (let j = 0; j < len; j += 1) {
            const e = square[i][j]
            if (e === 9) {
                direction.forEach(d => {
                    const newX = i + d[0]
                    const newY = j + d[1]

                    if (newX >= 0 && newY >= 0 && newX < 9 && newY < 9
                    ) {
                        if (square[newX][newY] !== 9) {
                            // 有雷就不加了
                            square[newX][newY] += 1
                        }
                    }
                })
            }
        }
    }
    return square
}

const genRandom = () => {
    return Math.floor(Math.random() * Math.floor(9))
}

const genTestData = () => {
    let cnt = 12
    let data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
    ]

    while (cnt) {
        data[genRandom()][genRandom()] = 9
        cnt -= 1
    }
    return data
}

const gameStart = () => {
    const mime = e('#game-wrapper')
    const testMime = e('#test-wrapper')

   // 可以抽函数
    while (mime.children.length) {
        const child = mime.children[0]
        mime.removeChild(child)
    }

    while (testMime.children.length) {
        const child = testMime.children[0]
        testMime.removeChild(child)
    }

    let data = genTestData()
    const map = genMap(data)
    const square = renderSquare(map, 'closed')
    const testSquare = renderSquare(map, 'opened')
    bindEventDelegate(square)
}

const _main = () => {
    gameStart()
}

_main()