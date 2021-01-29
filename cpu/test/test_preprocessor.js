
// 运算伪指令
// 1: .add var1 var2 ans
// 2: .if


// 运算伪指令测试
// .add
var asm_test_dot_add = function(){
    // a = a + a, a = a + b, a = b + b, c = a + b  测试ok
    // 加入常量测试: a = a + 1, a = 1 + a, a = 1 + 1
    asm = `
    .function main
    .var a 30
    .add 1 100 a

    .load a a2
    halt
`
    output = translate_fake_ins(asm)
}

// .if
var asm_test_dot_if = function(){
    // a = a + a, a = a + b, a = b + b, c = a + b  测试ok
    // 加入常量测试: a = a + 1, a = 1 + a, a = 1 + 1
    asm = `
    set2 a1 10
    set2 a2 20
    .if (a1 < a2){
        set2 a1 199
        set2 a2 299
    }
    halt
`
    output = translate_fake_ins(asm)
}

var asm_test_process_if_while = function(){
    // a = a + a, a = a + b, a = b + b, c = a + b  测试ok
    // 加入常量测试: a = a + 1, a = 1 + a, a = 1 + 1
    asm = `
    set2 a1 10
    set2 a2 20
    .if (a1 < a2){
        set2 a1 199
        set2 a2 299
        .add 123 23 123
    }
    .add 1 2 3
    .var x 10
    halt
`
    output = process_if_while(asm)
    log('output:', output)
}

var test_preprocessor = function(){
    asm_test_process_if_while()

    // 运算伪指令
    // asm_test_dot_add()
    // asm_test_dot_if()

    // 综合测试
    // asm_test_same_var_name()
    // asm_test_multiply()
}
