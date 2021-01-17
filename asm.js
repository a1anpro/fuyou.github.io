var clear_line = function(code_line) {
    // 清除一行的注释
    code_line = code_line.trim()
    i = code_line.indexOf(';')
    if (i != -1) {
        code_line = code_line.slice(0, i)
    }
    return code_line
}


var pre_process = function(asm_code) {
    // 预处理，功能仅仅是替换伪指令, 有一种情况是要考虑：函数作用域中可能也包含伪指令，要处理掉所有的
    var ret = []
    var asm_code = asm_code.split('\n')
    var i = 0

    while (i < asm_code.length) {
        code = clear_line(asm_code[i])
        if (code.length != 0) {
            ret = ret.concat(code.split(' '))
        }
        i++
    }
    return ret
}

var isValidCode = function(code) {
    code = code.trim()
    // 注释、空行、label、函数都不是有效行
    if (code.length == 0) {
        return false
    } else if (code[0] == ';' || code[0] == '#' || code[0] == '@') {
        return false
    }
    return true
}

// 在汇编前将有效的源码（非空行、注释行）的行号记录下来，之后用机器码对应一个个行号
var getValidCodeLines = function(asm_code) {
    var line_nums = []
    var code_lines = asm_code.split('\n')
    for (var i = 0; i < code_lines.length; ++i) {
        var code = code_lines[i]
        if (isValidCode(code) == true) {
            line_nums.push(i)
        }
    }
    return line_nums
}

// 把Assembler架空
var machine_code = function(asm_code) {
    var asm = Assembler.new(asm_code)
    asm.run()
    return asm.get_machine_code()
}

class Assembler {
    constructor(asm_code) {
        this.source_code = asm_code
        this.asm_code = asm_code

        this.init()

        this.mcode = []
        this.mcode_lines = []
        this.label_map = new Map()
        this.instructions = get_instructions()
        this.registers = get_registers()
    }

    static new(asm_code) {
        var i = new this(asm_code)
        return i
    }

    init() {
        // 得到有效代码行号的目的是为了让机器码和汇编代码对应起来，做高亮
        this.valid_lines = getValidCodeLines(this.asm_code)
        // 有效代码行号是从0起
        this.line_index = 0
        // log('有效代码行号:', this.valid_lines)

        // 翻译伪代码成标准汇编
        this.std_code = translate_fake_ins(this.asm_code)
        // log('标准代码:', this.std_code)
        // 预处理:将标准代码转成一个个token
        this.asm_code = pre_process(this.std_code)
        // log('asm_code:', this.asm_code)
    }

    fillValidLine(cnt) {
        var data = this.valid_lines[this.line_index]
        this.mcode_lines = this.mcode_lines.concat(Array(cnt).fill(data))
        this.line_index += 1
    }

    get_std_code(){
        return this.std_code
    }

    get_machine_code() {
        return this.mcode
    }

    get_valid_lines() {
        return this.valid_lines
    }
    get_mcode_lines() {
        return this.mcode_lines
    }
    get_labelmap() {
        return this.label_map
    }

    run() {
        // i是asm的下标
        var i = 0
        // 标记label的位置
        var offset = 0
        var label_map = this.label_map
        var label_cnt = new Map()

        var asm_code = this.asm_code
        var mcode = []
        var instructions = this.instructions
        var registers = this.registers

        while (i < asm_code.length) {
            code = asm_code[i].trim()
            // set 寄存器 数值
            if (code == 'set' || code == 'set2') {
                mcode.push(instructions[code])

                // 寄存器
                let asm_reg = asm_code[i + 1]
                let reg = registers[asm_reg]
                mcode.push(reg)

                // 数据
                let asm_data = asm_code[i + 2]
                let data = parseInt(asm_data)

                data = apart_data(data)
                let low = data[0]
                let high = data[1]
                if (code == 'set') {
                    offset += 3
                    mcode.push(low)
                    this.fillValidLine(3)
                } else {
                    offset += 4
                    mcode.push(low)
                    mcode.push(high)
                    this.fillValidLine(4)
                }
                i += 3
            } else if (code == 'load' || code == 'load2') {
                // load 内存地址 寄存器
                mcode.push(instructions[code])

                // 内存地址
                let mem_addr = asm_code[i + 1]
                let data = parseInt(mem_addr.slice(1))
                data = apart_data(data)
                let low = data[0]
                let high = data[1]

                if (code == 'load') {
                    offset += 3
                    mcode.push(low)
                    this.fillValidLine(3)
                } else {
                    offset += 4
                    mcode.push(low)
                    mcode.push(high)
                    this.fillValidLine(4)
                }
                let asm_reg = asm_code[i + 2]
                let reg = registers[asm_reg]
                mcode.push(reg)
                i += 3

            } else if (code == 'add' || code == 'add2') {
                // add 寄存器1 寄存器2 寄存器3
                mcode.push(instructions[code])
                // 寄存器1
                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)
                // 寄存器2
                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)
                // 寄存器3
                let asm_reg3 = asm_code[i + 3]
                let reg3 = registers[asm_reg3]
                mcode.push(reg3)

                i += 4
                offset += 4
                this.fillValidLine(4)
            } else if (code == 'save' || code == 'save2') {
                // save 寄存器1 内存地址
                mcode.push(instructions[code])

                let asm_reg = asm_code[i + 1]
                let reg = registers[asm_reg]
                mcode.push(reg)

                let mem_addr = asm_code[i + 2]
                let data = parseInt(mem_addr.slice(1))
                data = apart_data(data)
                let low = data[0]
                let high = data[1]

                if (code == 'save') {
                    offset += 3
                    mcode.push(low)
                    this.fillValidLine(3)
                } else {
                    offset += 4
                    mcode.push(low)
                    mcode.push(high)
                    this.fillValidLine(4)
                }
                i += 3
            } else if (code == 'compare') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)

                i += 3
                offset += 3
                this.fillValidLine(3)
            } else if (code == 'jump_if_less' || code == 'jump_if_great' || code == 'jump') {
                mcode.push(instructions[code])
                // 如果是地址则直接跳地址
                let nex = asm_code[i + 1].slice(1)

                if (isDigit(nex)) {
                    let addr = parseInt(nex)
                    let data = apart_data(addr)
                    let low = data[0]
                    let high = data[1]

                    mcode.push(low)
                    mcode.push(high)
                } else {
                    // 如果是label则跳label
                    // 需要做排错判断，如果说这个label并没有定义的话，则要提醒
                    label_cnt[asm_code[i+1]] = false // 出现一次，必须在label_map中出现，才算定义了，否则报错
                    mcode.push(asm_code[i + 1])
                    mcode.push(0)
                }
                i += 2
                offset += 3
                // 因为jump都是16位的
                this.fillValidLine(3)
            } else if (code == 'save_from_register') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)
                i += 3
                offset += 3
                this.fillValidLine(3)
            } else if (code == 'subtract2') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)

                let asm_reg3 = asm_code[i + 3]
                let reg3 = registers[asm_reg3]
                mcode.push(reg3)

                i += 4
                offset += 4
                this.fillValidLine(4)
            } else if (code == 'load_from_register' || code == 'load_from_register2') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)

                i += 3
                offset += 3
                this.fillValidLine(3)
            } else if (code == 'save_from_register2') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                let asm_reg2 = asm_code[i + 2]
                let reg2 = registers[asm_reg2]
                mcode.push(reg2)

                i += 3
                offset += 3
                this.fillValidLine(3)
            } else if (code == 'jump_from_register') {
                mcode.push(instructions[code])

                let asm_reg1 = asm_code[i + 1]
                let reg1 = registers[asm_reg1]
                mcode.push(reg1)

                i += 2
                offset += 2
                this.fillValidLine(2)
            } else if (code.indexOf('@') != -1 || code.indexOf('#') != -1) {
                let tag = mcode.length
                label_map.set(code, tag)
                i += 1
            } else if (code == '.memory') {
                let cnt = parseInt(asm_code[i + 1]) - mcode.length
                mcode = fillZero(mcode, cnt) // 再这里填充了.memory的数据用来做函数栈，所以代码段是在这个数据之后
                offset += cnt
                i += 2
                this.fillValidLine(cnt)
            } else if (code == 'halt') {
                mcode.push(instructions[code])
                offset += 1
                i += 1
                this.fillValidLine(1)
            } else {
                i++
            }
        }

        for (var i = 0; i < mcode.length; ++i) {
            if (label_map.has(mcode[i])) {
                // log('解除' + mcode[i])
                label_cnt[mcode[i]] = true
                var data = label_map.get(mcode[i])
                data = apart_data(data)
                mcode[i] = data[0]
                mcode[i + 1] = data[1]
            }
        }

        var keys = Object.keys(label_cnt)
        for (var i = 0; i < keys.length; ++i){
            var k = keys[i]
            var data = label_cnt[k]
            if (data == false){
                mcode = [k + '未定义']
            }
        }

        this.mcode = mcode
    }
}
