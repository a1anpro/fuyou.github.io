var test_set = function() {
    asm_code = `
        set a1 1
        halt
    `
    memory = machine_code(asm_code)
    // log('memory:', memory)
    // memory += [0] * (0x10000 - len(memory))
    var axepu = new AxePu(memory)
    axepu.run()

    a1 = axepu.get_register('a1')
    //
    expect = [1]
    output = [a1]
    // log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_set')
}

var test_set2 = function() {
    asm_code = `
        set2 a1 288
        halt
    `
    memory = machine_code(asm_code)
    // log('memory:', memory)
    // memory += [0] * (0x10000 - len(memory))
    var axepu = new AxePu(memory)
    axepu.run()

    a1 = axepu.get_register('a1')
    //
    expect = [288]
    output = [a1]
    // log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_set2')
}

var test_save = function() {
    asm_code = `
        set a1 10
        set a2 3
        save a1 @100
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()
    data = memory[100]
    //
    expect = [10]
    output = [data]
    // log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_save')
}

var test_save2 = function() {
    asm_code = `
        set a1 10
        set2 a2 3
        save2 a2 @258
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    data = memory[258]
    //
    expect = [3]
    output = [data]
    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_save2')
}

var test_load = function() {
    asm_code = `
        set a1 10
        set a2 3
        save a1 @100
        load @100 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    data = memory[100]
    a2 = axepu.get_register('a2')

    expect = [10, 10]
    output = [data, a2]
    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_load')
}

var test_load2 = function() {
    asm_code = `
        set2 a1 300
        save2 a1 @260
        load2 @260 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    mem_data1 = memory[260]
    mem_data2 = memory[261]
    a2 = axepu.get_register('a2')

    expect = [44, 1, 300]
    output = [mem_data1, mem_data2, a2]
    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_load2')
}

var test_add2 = function() {
    asm_code = `
        set2 a1 258
        set a2 10
        add2 a1 a2 a3
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    reg_data = axepu.get_register('a3')

    expect = [268]
    output = [reg_data]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_add2')
}

var test_subtract2 = function() {
    asm_code = `
        set2 a1 288
        set a2 10
        subtract2 a1 a2 a3
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    reg_data = axepu.get_register('a3')

    expect = [278]
    output = [reg_data]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_subtract2')
}

var test_save_from_register = function() {
    // 将a1的低8位的值存入a2的低8位内存中
    asm_code = `
        set2 a1 288
        set2 a2 100
        save_from_register a1 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    mem_data = memory[100]

    expect = [32]
    output = [mem_data]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_save_from_register')
}

var test_save_from_register2 = function() {
    // 将a1的低8位的值存入a2的低8位内存中
    asm_code = `
        set2 a1 2000
        set2 a2 2
        save_from_register2 a1 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    mem_data1 = memory[2]
    mem_data2 = memory[3]

    expect = [208, 7]
    output = [mem_data1, mem_data2]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_save_from_register2')
}

var test_load_from_register = function() {
    // 将a1的低8位的值存入a2的低8位内存中
    asm_code = `
        set2 a1 288
        set2 a2 258
        save2 a2 @32
        load_from_register a1 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    a2 = axepu.get_register('a2')

    expect = [2]
    output = [a2]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_load_from_register')
}

var test_load_from_register2 = function() {
    asm_code = `
        set2 a1 288
        set2 a2 258
        save2 a2 @288
        load_from_register2 a1 a2
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    a2 = axepu.get_register('a2')

    expect = [258]
    output = [a2]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_load_from_register2')
}

var test_jump_from_register = function() {
    asm_code = `
        set a1 9
        jump_from_register a1
        set a2 2
        halt

        set a2 10
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    a2 = axepu.get_register('a2')

    expect = [10]
    output = [a2]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump_from_register')
}

var test_jump_from_register_2 = function() {
    asm_code = `
        set2 a1 14
        set2 a2 157
        jump_from_register a1
        set2 a1 123
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    a1 = axepu.get_register('a1')
    a2 = axepu.get_register('a2')
    pa = axepu.get_register('pa')

    expect = [14, 157, 15]
    output = [a1, a2, pa]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump_from_register_2')
}

var test_jump = function() {
    asm_code = `
        set a1 5
        jump @label1

        @label1
        set a2 2
        add a1 a2 a1
        save a1 @100
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    mem_data = memory[100]

    expect = [7]
    output = [mem_data]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump')
}

var test_jump_if_less = function() {
    asm_code = `
        set a1 5
        set a2 10
        compare a1 a2
        jump_if_less @label1

        @label1
        set a1 1
        set a2 99
        add a1 a2 a1
        save a1 @100
        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    mem_data = memory[100]
    expect = [100]
    output = [mem_data]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump_if_less')
}

var test_jump_if_less_2 = function() {
    asm_code = `
        set2 a1 288
        set2 a2 157
        compare a1 a2
        jump_if_less @label1
        set2 a1 100
        @label1

        halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 1024-memory.length)

    var axepu = new AxePu(memory)
    axepu.run()

    a1 = axepu.get_register('a1')
    a2 = axepu.get_register('a2')


    expect = [100, 157]
    output = [a1, a2]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump_if_less_2')
}

var test_multiply = function() {
    asm_code = `jump @1024
.memory 1024

set2 f1 3 ;一开始设置到栈顶
jump @function_end ;先去设置一下内存结构

@function_multiply ;6
set2 a3 2
save2 a1 @65534

@while_start  ;15
compare a2 a3
jump_if_less @while_end

; 用a2来给a3加1
save2 a2 @65532
set2 a2 1
add2 a3 a2 a3

; 把a1原来的值存起来在加
load2 @65534 a2
add2 a1 a2 a1

load2 @65532 a2
jump @while_start ;18
@while_end ;47

set2 a3 2
subtract2 f1 a3 f1
load_from_register2 f1 a2
jump_from_register a2

@function_end ;61

;设置参数
set2 a1 10
set2 a2 3

set2 a3 14 ;4字节,设置f1是调用函数之后返回的位置
add2 pa a3 a3 ;4字节

save_from_register2 a3 f1 ;3字节
set2 a3 2 ;4字节
add2 f1 a3 f1 ;4字节
jump @function_multiply ;3字节,10
halt
    `
    memory = machine_code(asm_code)
    memory = fillZero(memory, 2 ** 16-memory.length)
    // log('len:', memory)

    var axepu = new AxePu(memory)
    axepu.run()

    a1 = axepu.get_register('a1')

    output = [a1]
    expect = [990]

    log('output:', output)
    assert(isArrayEqual(expect, output), '[vm] test_jump_if_less_2')
}


var test_vm = function() {
    // test_set()
    // test_set2()
    // test_save()
    // test_save2()
    // test_load2()
    // test_add2()
    // test_subtract2()
    // test_save_from_register()
    // test_save_from_register2()
    // test_load_from_register()
    // test_load_from_register2()
    // test_jump_from_register()
    // test_jump()
    // test_jump_if_less()
    // test_jump_if_less_2()
    // test_jump_from_register_2()
    test_multiply()
}
