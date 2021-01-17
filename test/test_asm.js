var asm_test_clean_line = function(){
    asm_code = `
        set a1 288 ;你好啊
    `
    ret = clear_line(asm_code)
    log(ret)
}

var asm_test_pre_process = function(){
    asm_code = `
        ;这是注释
        set a1 288 ;你好啊
        set a1 288 ;你好啊
        set a1 288 ;你好啊
    `
    ret = pre_process(asm_code)
    log(ret)
}

var asm_test_machine_code = function(){
    asm_code = `
        set a1 288 ;你好啊
    `
    ret = machine_code(asm_code)
}

var asm_test_xv16_set = function(){
    asm = `
            set a1 288
    `
    // 先低后高
    expected = [
        0, 16, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'set error')
}

var asm_test_xv16_set2 = function(){
    asm = `
            set2 a1 288
    `
    // 先低后高
    expected = [
        8, 16, 32, 1,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'set2 error')
}

var asm_test_xv16_load = function(){
    asm = `
        set a1 288
        load @258 a1
    `
    // 先低后高
    expected = [
        0, 16, 32,
        1, 2, 16,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'load error')
}

var asm_test_xv16_load2 = function(){
    asm = `
        set a1 0xbaef
        load2 @258 a1
    `
    // 先低后高
    expected = [
        0, 16, 239,
        9, 2, 1, 16,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'load2 error')
}

var asm_test_xv16_add = function(){
    asm = `
        set a1 1
        set a2 2
        add a1 a2 a1
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        2, 16, 32, 16,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'add error')
}

var asm_test_xv16_save = function(){
    asm = `
        set a1 1
        save a1 @258
        save a1 @387
        save a1 @128
    `
    // 先低后高
    expected = [
        0, 16, 1,
        3, 16, 2,
        3, 16, 131,
        3, 16, 128,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'save error')
}

var asm_test_xv16_save2 = function(){
    asm = `
    set2 a1 258
    save2 a1 @258
    save2 a1 @387
    save2 a1 @128
    `
    // 先低后高
    expected = [
        8, 16, 2, 1,
        11, 16, 2, 1,
        11, 16, 131, 1,
        11, 16, 128, 0,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'save2 error')
}

var asm_test_xv16_compare = function(){
    asm = `
    set a1 1
    set a2 2
    compare a1 a2
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        4, 16, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'compare error')
}

var asm_test_xv16_jump_if_less = function(){
    asm = `
            set2 a1 288
            set2 a2 157
            compare a1 a2
            jump_if_less @label1
            set2 a1 100
            @label1
            halt
    `
    // 先低后高
    expected = [
        8, 16, 32, 1,
       8, 32, 157, 0,
       4, 16, 32,
       5, 18, 0,
       8, 16, 100, 0,
       255,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'jump_if_less error')
}

var asm_test_xv16_jump = function(){
    asm = `
        set a1 1
        set a2 2
        jump @label1
        @label1

        set2 a1 10
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        6, 9, 0,
        8, 16, 10, 0,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'jump error')
}

var asm_test_xv16_save_from_register = function(){
    asm = `
        set a1 1
        set a2 2
        save_from_register a1 a2
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        7, 16, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'save_from_register error')
}

var asm_test_xv16_halt = function(){
    asm = `
    set a1 1
        set a2 2
        halt
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        255,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'halt error')
}

var asm_test_set2_load2_save2 = function(){
    asm = `
    set2 a1 288
    load2 @599 a1
    save2 a1 @777
    `
    // 先低后高
    expected = [
        8, 16, 32, 1,
        9, 87, 2, 16,
        11, 16, 9, 3,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'set2_load2_save2 error')
}

var asm_test_xv16_load_and_load2 = function(){
    asm = `
        load @100 a1
        load2 @100 a2
    `
    // 先低后高
    expected = [
        1, 100, 16,
        9, 100, 0, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'load_and_load2 error')
}

var asm_test_xv16_subtract2 = function(){
    asm = `
        set a1 1
        set a2 2
        subtract2 f1 a3 f1
    `
    // 先低后高
    expected = [
       0, 16, 1,
       0, 32, 2,
       12, 80, 48, 80,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'subtract2 error')
}

var asm_test_load_from_register = function(){
    asm = `
        set a1 1
        set a2 2
        load_from_register f1 a2
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        13, 80, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'load_from_register error')
}

var asm_test_load_from_register2 = function(){
    asm = `
        set a1 1
        set a2 2
        load_from_register f1 a2
        load_from_register2 f1 a2
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        13, 80, 32,
        14, 80, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'load_from_register2 error')
}

var asm_test_save_from_register2 = function(){
    asm = `
        set2 a1 1
        set2 a2 2
        save_from_register2 a1 a2
    `
    // 先低后高
    expected = [
        8, 16, 1, 0,
        8, 32, 2, 0,
        15, 16, 32,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'save_from_register2 error')
}

var asm_test_subtract2_jump = function(){
    asm = `
        set2 a1 1
        set a2 2
        subtract2 a1 a2 a1
        compare a1 a2
        jump @label1

        @label1
        halt
    `
    // 先低后高
    expected = [
        8, 16, 1, 0,
        0, 32, 2,
        12, 16, 32, 16,
        4, 16, 32,
        6, 17, 0,
        255,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'subtract2_jump error')
}

var asm_test_jump_from_register = function(){
    asm = `
        set a1 1
        set a2 2
        jump_from_register a1
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        16, 16,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'jump_from_register error')
}


var asm_test_annotation = function(){
    asm = `
        ; 这是注释
        set a1 1 ;这是注释
        set a2 2
        jump_from_register a1
    `
    // 先低后高
    expected = [
        0, 16, 1,
        0, 32, 2,
        16, 16,
    ]
    output = machine_code(asm)
    // log("output:", output)
    assert(isArrayEqual(output, expected), 'annotation error')
}
var asm_test_dot_memory = function(){
    asm = `
        .memory 1024
    `
    output = machine_code(asm)
    log("output:", output)
    // assert(isArrayEqual(output, expected), 'annotation error')
}
var asm_test_dot_call = function(){
    asm = `
        .call @function1
        @function1
        set2 a1 2
        halt
    `
    output = machine_code(asm)
    log("output:", output)
    // assert(isArrayEqual(output, expected), 'annotation error')
}
var asm_test_dot_return = function(){
    asm = `
        .call @function1
        @function1
        set2 a1 10
        set2 a2 2
        save_from_register2 a1 f1
        add2 f1 a2 f1
        .return 2

        halt
    `
    output = machine_code(asm)
    log("output:", output)
}


// 基础伪指令测试
var asm_test_dot_function = function(){
    asm = `
    .function main x y
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_dot_var = function(){
    asm = `
    .function main
    .var yanhui 10
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_dot_load = function(){
    asm = `
    .function main
    .var yanhui 10
    .var temp 20
    .load temp a1
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_dot_assign = function(){
    // .assign reg name
    asm = `
    .function main
    .var yanhui 99
    .var temp 20
    .load yanhui a1

    .assign a1 temp
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_dot_end_function = function(){
    asm = `
    .function main x y

    .end_function main
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_dot_call_function = function(){
    asm = `
    jump @1024
    .memory 1024
    set2 f1 3 ;一开始设置到栈顶
    jump #main ;直接跳到main函数

    .function function_add x y
        .return_func
    .end_function function_add

    .function main
        .var yanhui 213
        .var iris 34
        .call_function function_add yanhui yanhui
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_return_func = function(){
    asm = `
    .init

    .function function_add x y
    .return_func
    .end_function function_add

    .function main
        .var yanhui 213
        .var iris 34
        .call_function function_add yanhui yanhui

        .return_func
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

var asm_test_fake_add = function(){
    asm = `
    .init

    .function function_add x y
    .var sum 0
    .add x y sum
    .return_func sum
    .end_function function_add

    .function main
    .var a 199
    .var b 3
    .call_function function_add a b

    .load_return sum
    .load sum a2

    .return_func
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

// 综合测试
// 乘法测试
var asm_test_multiply = function(){
    asm = `
    jump @1024
    .memory 1024
    set2 f1 3 ;一开始设置到栈顶
    jump #main ;直接跳到main函数

    .function function_multiply x y
    .var i 0
    .var sum 0

    ;首先比较i和y的大小，目前比较大小只能用寄存器
    ;目前左右运算符都需要在寄存器中使用
    @while_start
    .load i a1
    .load y a2
    compare a1 a2
    jump_if_less @while_block
    jump @while_end

    @while_block
    .add x sum sum
    .add i 1 i
    jump @while_start
    @while_end

    .return_func sum
    .end_function function_multiply

    .function main
    .var a 30
    .var b 3
    .call_function function_multiply a b
    .load_return sum
    .load sum a2
    halt
`
    output = machine_code(asm)
    log("output:", output)
}

// 不同作用域，相同变量名
var asm_test_same_var_name = function(){
    asm = `
    jump @1024
    .memory 1024
    set2 f1 3 ;一开始设置到栈顶
    jump #main ;直接跳到main函数

    .function func para
    .var name 100
    .return_func
    .end_function func

    .function main
    .var para 10
    .call_function func para

    ; main函数不用做这步 .return_func

    halt
`
    output = machine_code(asm)
    log("output:", output)
}


// 阶乘测试
var asm_test_factorial = function(){
    asm = `
    jump @1024
    .memory 1024
    set2 f1 3 ;一开始设置到栈顶
    jump #main ;直接跳到main函数

    .function function_multiply x y
    .var i 0
    .var sum 0

    ;首先比较i和y的大小，目前比较大小只能用寄存器
    ;目前左右运算符都需要在寄存器中使用
    @while_start
    .load i a1
    .load y a2
    compare a1 a2
    jump_if_less @while_block
    jump @while_end

    @while_block
    .load x a1
    .load sum a2
    add2 a1 a2 a2
    .assign a2 sum ;将计算的临时和放入sum

    .load i a1
    set2 a2 1
    add2 a1 a2 a1
    .assign a1 i
    jump @while_start
    @while_end

    .return_func sum
    .end_function function_multiply


    .function main
    .var a 30
    .var b 3
    .var ans 100

    .add a b ans

    .load ans a2
    halt
`
    output = machine_code(asm)
    log("output:", output)
}



// 基础伪指令
// 1: .var name 10
// 2: .load name reg
// 3: .assign reg name
// 4: .function function_name paras[]
// 5: .end_function function_name
// 5: .call_function function_name paras[]
// 6: .return_func name

var test_asm = function(){
    // 运算伪指令
    // asm_test_dot_add()

    // 基础伪指令
    // asm_test_dot_function()
    // asm_test_dot_var()
    // asm_test_dot_end_function()
    // asm_test_dot_load()
    // asm_test_dot_assign()
    // asm_test_dot_call_function()
    // asm_test_return_func()
    asm_test_fake_add()

    // 综合测试
    // asm_test_same_var_name()
    // asm_test_multiply()

    // asm_test_dot_return()
    // asm_test_dot_call()
    // asm_test_dot_memory()
    // asm_test_xv16_set()
    // asm_test_xv16_set2()
    // asm_test_xv16_load()
    // asm_test_xv16_load2()
    // asm_test_xv16_add()
    // asm_test_xv16_save()
    // asm_test_xv16_save2()
    // asm_test_xv16_compare()
    // asm_test_xv16_jump_if_less()
    // asm_test_xv16_jump()
    // asm_test_xv16_save_from_register()
    // asm_test_xv16_halt()
    // asm_test_set2_load2_save2()
    // asm_test_xv16_load_and_load2()
    // asm_test_xv16_subtract2()
    // asm_test_load_from_register()
    // asm_test_load_from_register2()
    // asm_test_save_from_register2()
    // asm_test_subtract2_jump()
    // asm_test_jump_from_register()
    // asm_test_annotation()
}
