const es = selector => document.querySelectorAll(selector)
const e = selector => document.querySelector(selector)
const log = console.log.bind(console)


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
    for (let i = 1; i <= 9; i += 1) {
        drawRow(ctx, cell, i)
    }
}

const drawText = (ctx, text, x, y) => {
    ctx.font = "bold 20px Arial"
    // log('text:', text, typeof text)
    const color = {
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

const getPos = (x, y) => {
    // 根据坐标 算网格坐标
    return [Math.ceil(x / 25), Math.ceil(y / 25)]
}

const renderSquare = (ctx) => {
    // 根据statusMap来render整个地图
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            const status = statusMap[i][j]
            if (status === 1) {
                // 根据gameMap显示数字
                drawText(gameCtx, gameMap[i][j].toString(), i + 1, j + 1)
            } else if (status === -1) {
                // 显示地雷
                drawCell(gameCtx, blackBoom, i + 1, j + 1)
            } else if (status === -2) {
                drawCell(gameCtx, redBoom, i + 1, j + 1)
            } else if (status === -3) {
                // 展开的空白
                drawCell(gameCtx, empty, i + 1, j + 1)
            } else if (status === -4) {
                drawCell(gameCtx, flagImg, i + 1, j + 1)
            } else if (status === -5) {
                drawCell(gameCtx, questionImg, i + 1, j + 1)
            } else if (status === 0) {
                drawCell(gameCtx, cell, i + 1, j + 1)
            }
        }
    }
}

const vjklAll = () => {
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            const status = gameMap[i][j]
            if (status === 9) {
                statusMap[i][j] = -1
            } else if (status === 0) {
                statusMap[i][j] = -3
            } else {
                statusMap[i][j] = 1
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
            // 2- 判断周围坐标是否符合打开条件，也就是地图为0的
            if (gameMap[newX][newY] === 0) {
                vjklSelf(newX, newY, flag)
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
    if (type === 0) {
        log('here')
        const m = gameMap[i][j]
        if (m === 9) {
            // -2表示红色雷
            vjklAll()
            statusMap[i][j] = -2
        } else if (m === 0) {
            vjklAround(i, j, -3)
        } else {
            vjklSelf(i, j, 1)
        }
    } else if (type === 2) {
        // 渲染旗子, 点击不同的次数 切换不同的状态
        const status = statusMap[i][j]
        log('status:', status)
        if (status === 0) {
            statusMap[i][j] = -4
        } else if (status === -4) {
            statusMap[i][j] = -5
        } else if (status === -5) {
            statusMap[i][j] = 0
        }
    }

    renderSquare(ctx)
}

const bindEventDelegate = function (canvas, ctx) {
    canvas.addEventListener('mousedown', (event) => {
        const type = event.button
        const [x, y] = getPos(event.offsetX, event.offsetY)
        handleClick(ctx, x, y, type)
    })
}

const gameStart = () => {
    initMap()
    // game canvas
    drawSquare(gameCtx)
    // 画测试数据地图
    drawSquare(testCtx)
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            drawText(testCtx, gameMap[i][j], i + 1, j + 1)
        }
    }
}

const run = () => {
    gameStart()
    // 给canvas绑定点击事件，在gamectx上画图
    bindEventDelegate(gameCanvas, gameCtx)
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

const initMap = () => {
    data = genTestData()
    gameMap = genMap(data)
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
let statusMap = null

const _main = () => {
    redBoom.onload = function () {
        run()
    }
}

_main()