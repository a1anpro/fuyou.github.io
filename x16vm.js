var debug = true
var debug_print = function(...args){
    if (debug == true){
        log(...args)
    }
}

class AxePu{
    // 参数给constructor
    constructor(memory){
        // 不需要instructions
        this.registers = {
            "pa": 0,
            "a1": 0,
            "a2": 0,
            "a3": 0,
            "c1": 0,
            "f1": 0,
        }
        this.reg_mapper = get_reg_mapper()
        this.memory = memory
    }

    // static new(memory){
    //   var i = new this(memory)
    //   return i
    // }

    do_next_ins(){
        var pa = this.registers['pa']

        if (pa >= this.memory.length){
            return false
        }
        // log('memory[pa]:', memory[pa])
        var memory = this.memory
        // 执行一个指令前，先移动pa
        if (memory[pa] == 0b00000000){
            log('竟然走到了set这里,pa=', pa, memory[pa])
            // set
            // 先设置pa到下一条指令地址
            this.registers['pa'] += 3
            // 需要寄存器机器码和寄存器名对应
            let m_reg = memory[pa + 1]
            let reg = this.reg_mapper[m_reg]

            let data = memory[pa + 2]
            this.registers[reg] = data
            // log('a1:', this.registers['a1'])
            debug_print('set ', reg, data)
        } else if (memory[pa] == 0b00001000){
            // set2
            this.registers['pa'] += 4
            let m_reg = memory[pa + 1]
            let reg = this.reg_mapper[m_reg]

            // 拼接数据
            let low = memory[pa + 2]
            let high = memory[pa + 3]
            let data = restore_from_little(low, high)
            this.registers[reg] = data

            debug_print('set2 ', reg, data)
        } else if (memory[pa] == 0b00000011){
            // save 寄存器1 内存地址
            // log('执行save:', memory)
            this.registers['pa'] += 3
            let m_reg = memory[pa + 1]
            let reg = this.reg_mapper[m_reg]

            // 存单字节地址即可
            let mem_addr = memory[pa + 2]
            memory[mem_addr] = this.registers[reg]
            debug_print('save', reg, mem_addr)
        } else if (memory[pa] == 0b00001011){
            // save2 寄存器 内存地址
            this.registers['pa'] += 4
            let m_reg = memory[pa + 1]
            let reg = this.reg_mapper[m_reg]

            // # 拼接16位地址
            let low = memory[pa + 2]
            let high = memory[pa + 3]
            let mem_addr = restore_from_little(low, high)

            // # 高低八位的值分别存入高低内存，将reg的值拆分
            let data = this.registers[reg]
            data = apart_data(data)
            memory[mem_addr] = data[0]
            memory[mem_addr + 1] = data[1]

            debug_print('save2', reg, mem_addr)
        } else if (memory[pa] == 0b00000001){
            // load 内存 寄存器
            this.registers['pa'] += 3

            // 只读一字节地址
            let mem_addr = memory[pa + 1]
            let m_reg = memory[pa + 2]
            let reg = this.reg_mapper[m_reg]

            this.registers[reg] = memory[mem_addr]

            debug_print('load', mem_addr, reg)
        } else if (memory[pa] == 0b00001001){
            // load2 内存 寄存器
            this.registers['pa'] += 4
            // 拼接地址
            let mem_addr = restore_from_little(memory[pa + 1], memory[pa + 2])
            // 拼接地址对应的数据，高低8位
            let low_data = memory[mem_addr]
            let high_data = memory[mem_addr + 1]
            let data = restore_from_little(low_data, high_data)

            let m_reg = memory[pa + 3]
            let reg = this.reg_mapper[m_reg]

            // 寄存器是16位的，存的数据应该是两个内存组装的值
            this.registers[reg] = data

            debug_print('load2', mem_addr, reg)
        } else if (memory[pa] == 0b00001010){
            // add2
            this.registers['pa'] += 4
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            let m_reg3 = memory[pa + 3]
            let reg3 = this.reg_mapper[m_reg3]

            this.registers[reg3] = this.registers[reg1] + this.registers[reg2]
            debug_print('add2', reg1, reg2, reg3)
        } else if (memory[pa] == 0b00000010){
            // add
            this.registers['pa'] += 4
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            let m_reg3 = memory[pa + 3]
            let reg3 = this.reg_mapper[m_reg3]

            this.registers[reg3] = this.registers[reg1] + this.registers[reg2]

            debug_print('add', reg1, reg2, reg3)
        } else if (memory[pa] == 0b00001100){
            // subtract2
            this.registers['pa'] += 4
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            let m_reg3 = memory[pa + 3]
            let reg3 = this.reg_mapper[m_reg3]

            this.registers[reg3] = this.registers[reg1] - this.registers[reg2]

            debug_print('subtract2', reg1, reg2, reg3)
        } else if (memory[pa] == 0b00000111){
            // save_from_register
            this.registers['pa'] += 3
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            let mem_addr = read_low_8bit(this.registers[reg2])
            memory[mem_addr] = read_low_8bit(this.registers[reg1])

            debug_print('save_from_register', reg1, reg2)
        } else if (memory[pa] == 0b00001111){
            // save_from_register2
            this.registers['pa'] += 3
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            // 寄存器reg1存的是值，reg2存的是地址
            // 值是16位的，地址也是16位的，所以要把值拆成高低8位

            let mem_addr = this.registers[reg2]
            let data = this.registers[reg1]
            data = apart_data(data)
            debug_print('data[0]\[1]:', data[0], data[1])
            memory[mem_addr] = data[0]
            memory[mem_addr + 1] = data[1]

            debug_print('save_from_register2', reg1, reg2)
        } else if (memory[pa] == 0b00001101){
            // load_from_register
            // 把第一个寄存器的内存地址的值 放入第二个寄存器的中
            this.registers['pa'] += 3
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            // 此时reg1是一个内存地址，地址可能大于255，只留低8位
            // 内存的值也可能是大于255，也只留低8位
            let mem_addr = read_low_8bit(this.registers[reg1])

            this.registers[reg2] = read_low_8bit(memory[mem_addr])

            debug_print('load_from_register', reg1, reg2)
        } else if (memory[pa] == 0b00001110){
            this.registers['pa'] += 3

            // load的也是需要组合的
            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]

            let mem_addr = this.registers[reg1]
            let low = memory[mem_addr]
            let high = memory[mem_addr + 1]
            let data = restore_from_little(low, high)
            this.registers[reg2] = data

            debug_print('load_from_register2', reg1, reg2)
        } else if (memory[pa] == 0b00010000){
            // jump_from_register
           let m_reg1 = memory[pa + 1]
           let reg1 = this.reg_mapper[m_reg1]

           this.registers['pa'] = this.registers[reg1]

           debug_print('jump_from_register', reg1, this.registers[reg1])
        } else if (memory[pa] == 0b00000110){
            // jump
            let low = memory[pa + 1]
            let high = memory[pa + 2]
            let mem_addr = restore_from_little(low, high)

            this.registers['pa'] = mem_addr
            debug_print('jump', mem_addr)
        } else if (memory[pa] == 0b00000101){
            // jump_if_less
           let low = memory[pa + 1]
           let high = memory[pa + 2]
           let mem_addr = restore_from_little(low, high)

           let c1 = this.registers['c1']
           if (c1 == 2){  // 第一个参数小于第二个参数
               this.registers['pa'] = mem_addr
           } else{
               this.registers['pa'] += 3
           }
           debug_print('jump_if_less', mem_addr)
        } else if (memory[pa] == 0b00000100){
            // compare
            this.registers['pa'] += 3

            let m_reg1 = memory[pa + 1]
            let reg1 = this.reg_mapper[m_reg1]
            let data1 = this.registers[reg1]

            let m_reg2 = memory[pa + 2]
            let reg2 = this.reg_mapper[m_reg2]
            let data2 = this.registers[reg2]

            if (data1 < data2){
                this.registers['c1'] = 2
            } else if (data1 > data2){
                this.registers['c1'] = 1
            } else{
                this.registers['c1'] = 0
            }
            debug_print('compare', reg1, reg2)
        } else if (memory[pa] == 0xff){
            this.registers['pa'] += 1
            debug_print('halt, ', this.registers['pa'])
            // return false
        } else {
            debug_print('指令错误的pa:', pa, memory[pa])
            window.alert('错误指令')
            return false
        }

        this.memory = memory
        return true
    }

    get_all_registers(reg){
        // 返回所有寄存器
        return this.registers
    }
    get_register(reg){
        // 返回指定寄存器值
        return this.registers[reg]
    }
    get_memory(reg){
        return this.memory
    }

    run(){
        var state = true

        while (state == true){
            state = this.do_next_ins()
        }
        return this.memory
    }
}
