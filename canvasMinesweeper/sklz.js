const es = selector => document.querySelectorAll(selector)
const e = selector => document.querySelector(selector)
const log = console.log.bind(console)
const genRandom = () => {
    return Math.floor(Math.random() * Math.floor(9))
}

const STATUS_TYPE = {
    NUMBER: 1,
    CELL: 0,
    BLACK_BOOM: -1,
    RED_BOOM: -2,
    EMPTY: -3,
    FLAG: -4,
    QUESTION: -5,
}

const MOUSE_TYPE = {
    LEFT_CLICK: 0,
    RIGHT_CLICK: 2,
}

const getEmptySquare = () => {
    return [
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

const drawCell = (ctx, img, x, y) => {
    ctx.drawImage(img, (x - 1) * cellSize, (y - 1) * cellSize)
}

const drawRow = (ctx, img, line) => {
    for (let i = 1; i <= 9; i += 1) {
        drawCell(ctx, cell, i, line)
    }
}

const drawSquare = (ctx) => {
    // draw 之前需要先清除原来的
    for (let i = 1; i <= 9; i += 1) {
        drawRow(ctx, cell, i)
    }
}

const drawText = (ctx, text, x, y) => {
    // 清除这个格子
    // ctx.clearRect((x - 1) * 25, (y - 1) * 25, 25, 25)
    drawCell(ctx, cell, x, y)
    ctx.font = "bold 20px Arial"
    const color = {
        '0': 'white',
        '1': 'blue',
        '2': 'green',
        '3': 'red',
        '4': '#04207f',
        '5': '#800f00',
        '6': '#067f7f',
        '7': 'black',
        '8': '#808080',
    }
    ctx.fillStyle = color[text]
    ctx.fillText(text, 8 + 25 * (x - 1), 25 * (y - 1) + 20)
}

const drawTestMap = (map) => {
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            const x = i + 1
            const y = j + 1
            const m = map[i][j]
            if (m === 9) {
                drawCell(testCtx, blackBoom, x, y)
            } else if (m === 0) {
                drawCell(testCtx, empty, x, y)
            } else {
                drawText(testCtx, map[i][j], x, y)
            }
        }
    }
}

const getPos = (x, y) => {
    // 根据坐标 算网格坐标
    return [Math.ceil(x / 25), Math.ceil(y / 25)]
}

const renderSquare = (ctx) => {
    // 根据statusMap来render整个地图
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            const status = statusMap[i][j]
            const x = i + 1
            const y = j + 1
            if (status === STATUS_TYPE.NUMBER) {
                // 根据gameMap显示数字
                drawText(gameCtx, gameMap[i][j].toString(), x, y)
            } else if (status === STATUS_TYPE.BLACK_BOOM) {
                // 显示地雷
                drawCell(gameCtx, blackBoom, x, y)
            } else if (status === STATUS_TYPE.RED_BOOM) {
                drawCell(gameCtx, redBoom, x, y)
            } else if (status === STATUS_TYPE.EMPTY) {
                drawCell(gameCtx, empty, x, y)
            } else if (status === STATUS_TYPE.FLAG) {
                drawCell(gameCtx, flagImg, x, y)
            } else if (status === STATUS_TYPE.QUESTION) {
                drawCell(gameCtx, questionImg, x, y)
            } else if (status === STATUS_TYPE.CELL) {
                drawCell(gameCtx, cell, x, y)
            }
        }
    }
}

const vjklAll = () => {
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            // 只展开炸弹
            const status = gameMap[i][j]
            if (status === 9) {
                statusMap[i][j] = -1
            }
        }
    }
}

const vjklAround = (i, j, flag) => {
    vjklSelf(i, j, flag)
    const direction = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
    direction.forEach(d => {
        const newX = i + d[0]
        const newY = j + d[1]
        // 打开周围的8个坐标，这8个自己再去递归, 至于递归到哪里 不管
        if (newX >= 0 && newY >= 0 && newX < 9 && newY < 9) {
            // log(i, j, newX, newY, `(${gameMap[newX][newY]})`)
            // 1- 满足坐标边界条件
            // 2- 判断周围坐标是否符合打开条件，也就是地图为非9的
            const s = gameMap[newX][newY]
            if (s === 0) {
                // 需要连锁反应
                vjklSelf(newX, newY, -3)
            } else if (s !== 9) {
                // 不需要连锁反应
                vjklSelf(newX, newY, 1)
            }
        }
    })
}

const vjklSelf = (i, j, flag) => {
    // 因为空白和数字状态不同
    if (i >= 0 && j >= 0 && i < 9 && j < 9) {
        // 1- 符合坐标，且没打开，则打开
        // 2- 再看打开的周围
        if (statusMap[i][j] === 0 && gameMap[i][j] === 0) {
            statusMap[i][j] = flag
            vjklAround(i, j, flag)
        } else {
            statusMap[i][j] = flag
        }
    }
}

const handleClick = (ctx, x, y, type) => {
    // 核心函数，点击后的操作！
    // 根据statusMap来画图
    // 根据gameMap来影响statusMap
    // 如果gameMap是9，则展开所有的数据
    const i = x - 1
    const j = y - 1
    const status = statusMap[i][j]
    // log('type:', type)
    // 非标记状态，才修改statusMap
    if (type === MOUSE_TYPE.LEFT_CLICK && !inMarkStatus(x, y)) {
        const m = gameMap[i][j]
        if (m === 9) {
            // -2表示红色雷
            gameOver = true
            vjklAll()
            statusMap[i][j] = -2
        } else if (m === 0) {
            vjklAround(i, j, -3)
        } else {
            vjklSelf(i, j, 1)
        }
    } else if (type === MOUSE_TYPE.RIGHT_CLICK) {
        // log('前status:', status)
        // 渲染旗子, 点击不同的次数 切换不同的状态
        if (status === STATUS_TYPE.CELL) {
            statusMap[i][j] = STATUS_TYPE.FLAG
        } else if (status === STATUS_TYPE.FLAG) {
            statusMap[i][j] = STATUS_TYPE.QUESTION
        } else if (status === STATUS_TYPE.QUESTION) {
            statusMap[i][j] = STATUS_TYPE.CELL
        }
        // log('后status:', statusMap[i][j])
    }

    renderSquare(ctx)
}

const inMarkStatus = (x, y) => {
    const status = statusMap[x - 1][y - 1]
    return [STATUS_TYPE.FLAG, STATUS_TYPE.QUESTION].includes(status)
}

const handleMousedown = (event) => {
    log('点击')
    const type = event.button
    const [x, y] = getPos(event.offsetX, event.offsetY)
    // 第一次点击之后生成地图
    if (firstClick && type === MOUSE_TYPE.LEFT_CLICK && !inMarkStatus(x, y)) {
        firstClick = false
        data = genTestData(x, y)
        gameMap = genMap(data)
        // 画出测试地图
        drawTestMap(gameMap)
    }
    if (!gameOver) {
        handleClick(gameCtx, x, y, type)
    }
}

const bindEventDelegate = function (canvas, ctx) {
    canvas.removeEventListener('mousedown', handleMousedown)
    canvas.addEventListener('mousedown', handleMousedown)
}

const clearSquare = (ctx) => {
    ctx.clearRect(0, 0, 225, 225)
}

const run = () => {
    clearSquare(gameCtx)
    clearSquare(testCtx)

    // 画空游戏表盘
    drawSquare(gameCtx)
    // 画测试表盘
    drawSquare(testCtx)
    initGlobalData()

    // 给canvas绑定点击事件，在gamectx上画图
    bindEventDelegate(gameCanvas, gameCtx)
}

const genTestData = (x, y) => {
    let count = 20
    let map = getEmptySquare()
    // 随机地雷
    while (count) {
        map[genRandom()][genRandom()] = 9
        count -= 1
    }

    // 手动设置第一次点击位置为0
    map[x - 1][y - 1] = 0
    const direction = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    // 周围也设置成0
    direction.forEach(d => {
        const newX = x - 1 + d[0]
        const newY = y - 1 + d[1]

        if (newX >= 0 && newY >= 0 && newX < 9 && newY < 9
        ) {
            map[newX][newY] = 0
        }
    })
    return map
}

const initGlobalData = () => {
    gameOver = false
    firstClick = true
    statusMap = [
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
}

// 先秋裤全局
// 画布也先做全局的
var gameCanvas = e('#id-game-canvas');
var gameCtx = gameCanvas.getContext('2d');

var testCanvas = e('#id-test-canvas');
var testCtx = testCanvas.getContext('2d');

// 先用全局变量来管理资源
var cell = new Image()
var redBoom = new Image()
var blackBoom = new Image()
var empty = new Image()
var flagImg = new Image()
var questionImg = new Image()

cell.src = './static/cell.png'
redBoom.src = './static/red_boom.png'
blackBoom.src = './static/black_boom.png'
empty.src = './static/empty.png'
flagImg.src = './static/flag.png'
questionImg.src = './static/question.png'
const cellSize = 25

let data = null
let gameMap = null
let statusMap = getEmptySquare()
let gameOver = false
let firstClick = true

const _main = () => {
    redBoom.onload = function () {
        run()
    }
}

_main()