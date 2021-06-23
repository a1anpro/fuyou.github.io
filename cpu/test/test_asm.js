"use strict";var asm_test_clean_line=function(){asm_code="\n        set a1 288 ;你好啊\n    ",ret=clear_line(asm_code),log(ret)},asm_test_pre_process=function(){asm_code="\n        ;这是注释\n        set a1 288 ;你好啊\n        set a1 288 ;你好啊\n        set a1 288 ;你好啊\n    ",ret=pre_process(asm_code),log(ret)},asm_test_machine_code=function(){asm_code="\n        set a1 288 ;你好啊\n    ",ret=machine_code(asm_code)},asm_test_xv16_set=function(){asm="\n            set a1 288\n    ",expected=[0,16,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"set error")},asm_test_xv16_set2=function(){asm="\n            set2 a1 288\n    ",expected=[8,16,32,1],output=machine_code(asm),assert(isArrayEqual(output,expected),"set2 error")},asm_test_xv16_load=function(){asm="\n        set a1 288\n        load @258 a1\n    ",expected=[0,16,32,1,2,16],output=machine_code(asm),assert(isArrayEqual(output,expected),"load error")},asm_test_xv16_load2=function(){asm="\n        set a1 0xbaef\n        load2 @258 a1\n    ",expected=[0,16,239,9,2,1,16],output=machine_code(asm),assert(isArrayEqual(output,expected),"load2 error")},asm_test_xv16_add=function(){asm="\n        set a1 1\n        set a2 2\n        add a1 a2 a1\n    ",expected=[0,16,1,0,32,2,2,16,32,16],output=machine_code(asm),assert(isArrayEqual(output,expected),"add error")},asm_test_xv16_save=function(){asm="\n        set a1 1\n        save a1 @258\n        save a1 @387\n        save a1 @128\n    ",expected=[0,16,1,3,16,2,3,16,131,3,16,128],output=machine_code(asm),assert(isArrayEqual(output,expected),"save error")},asm_test_xv16_save2=function(){asm="\n    set2 a1 258\n    save2 a1 @258\n    save2 a1 @387\n    save2 a1 @128\n    ",expected=[8,16,2,1,11,16,2,1,11,16,131,1,11,16,128,0],output=machine_code(asm),assert(isArrayEqual(output,expected),"save2 error")},asm_test_xv16_compare=function(){asm="\n    set a1 1\n    set a2 2\n    compare a1 a2\n    ",expected=[0,16,1,0,32,2,4,16,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"compare error")},asm_test_xv16_jump_if_less=function(){asm="\n            set2 a1 288\n            set2 a2 157\n            compare a1 a2\n            jump_if_less @label1\n            set2 a1 100\n            @label1\n            halt\n    ",expected=[8,16,32,1,8,32,157,0,4,16,32,5,18,0,8,16,100,0,255],output=machine_code(asm),assert(isArrayEqual(output,expected),"jump_if_less error")},asm_test_xv16_jump=function(){asm="\n        set a1 1\n        set a2 2\n        jump @label1\n        @label1\n\n        set2 a1 10\n    ",expected=[0,16,1,0,32,2,6,9,0,8,16,10,0],output=machine_code(asm),assert(isArrayEqual(output,expected),"jump error")},asm_test_xv16_save_from_register=function(){asm="\n        set a1 1\n        set a2 2\n        save_from_register a1 a2\n    ",expected=[0,16,1,0,32,2,7,16,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"save_from_register error")},asm_test_xv16_halt=function(){asm="\n    set a1 1\n        set a2 2\n        halt\n    ",expected=[0,16,1,0,32,2,255],output=machine_code(asm),assert(isArrayEqual(output,expected),"halt error")},asm_test_set2_load2_save2=function(){asm="\n    set2 a1 288\n    load2 @599 a1\n    save2 a1 @777\n    ",expected=[8,16,32,1,9,87,2,16,11,16,9,3],output=machine_code(asm),assert(isArrayEqual(output,expected),"set2_load2_save2 error")},asm_test_xv16_load_and_load2=function(){asm="\n        load @100 a1\n        load2 @100 a2\n    ",expected=[1,100,16,9,100,0,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"load_and_load2 error")},asm_test_xv16_subtract2=function(){asm="\n        set a1 1\n        set a2 2\n        subtract2 f1 a3 f1\n    ",expected=[0,16,1,0,32,2,12,80,48,80],output=machine_code(asm),assert(isArrayEqual(output,expected),"subtract2 error")},asm_test_load_from_register=function(){asm="\n        set a1 1\n        set a2 2\n        load_from_register f1 a2\n    ",expected=[0,16,1,0,32,2,13,80,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"load_from_register error")},asm_test_load_from_register2=function(){asm="\n        set a1 1\n        set a2 2\n        load_from_register f1 a2\n        load_from_register2 f1 a2\n    ",expected=[0,16,1,0,32,2,13,80,32,14,80,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"load_from_register2 error")},asm_test_save_from_register2=function(){asm="\n        set2 a1 1\n        set2 a2 2\n        save_from_register2 a1 a2\n    ",expected=[8,16,1,0,8,32,2,0,15,16,32],output=machine_code(asm),assert(isArrayEqual(output,expected),"save_from_register2 error")},asm_test_subtract2_jump=function(){asm="\n        set2 a1 1\n        set a2 2\n        subtract2 a1 a2 a1\n        compare a1 a2\n        jump @label1\n\n        @label1\n        halt\n    ",expected=[8,16,1,0,0,32,2,12,16,32,16,4,16,32,6,17,0,255],output=machine_code(asm),assert(isArrayEqual(output,expected),"subtract2_jump error")},asm_test_jump_from_register=function(){asm="\n        set a1 1\n        set a2 2\n        jump_from_register a1\n    ",expected=[0,16,1,0,32,2,16,16],output=machine_code(asm),assert(isArrayEqual(output,expected),"jump_from_register error")},asm_test_annotation=function(){asm="\n        ; 这是注释\n        set a1 1 ;这是注释\n        set a2 2\n        jump_from_register a1\n    ",expected=[0,16,1,0,32,2,16,16],output=machine_code(asm),assert(isArrayEqual(output,expected),"annotation error")},asm_test_dot_memory=function(){asm="\n        .memory 1024\n    ",output=machine_code(asm),log("output:",output)},asm_test_dot_call=function(){asm="\n        .call @function1\n        @function1\n        set2 a1 2\n        halt\n    ",output=machine_code(asm),log("output:",output)},asm_test_dot_return=function(){asm="\n        .call @function1\n        @function1\n        set2 a1 10\n        set2 a2 2\n        save_from_register2 a1 f1\n        add2 f1 a2 f1\n        .return 2\n\n        halt\n    ",output=machine_code(asm),log("output:",output)},asm_test_dot_function=function(){asm="\n    .function main x y\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_dot_var=function(){asm="\n    .function main\n    .var yanhui 10\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_dot_load=function(){asm="\n    .function main\n    .var yanhui 10\n    .var temp 20\n    .load temp a1\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_dot_assign=function(){asm="\n    .function main\n    .var yanhui 99\n    .var temp 20\n    .load yanhui a1\n\n    .assign a1 temp\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_dot_end_function=function(){asm="\n    .function main x y\n\n    .end_function main\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_dot_call_function=function(){asm="\n    jump @1024\n    .memory 1024\n    set2 f1 3 ;一开始设置到栈顶\n    jump #main ;直接跳到main函数\n\n    .function function_add x y\n        .return_func\n    .end_function function_add\n\n    .function main\n        .var yanhui 213\n        .var iris 34\n        .call_function function_add yanhui yanhui\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_return_func=function(){asm="\n    .init\n\n    .function function_add x y\n    .return_func\n    .end_function function_add\n\n    .function main\n        .var yanhui 213\n        .var iris 34\n        .call_function function_add yanhui yanhui\n\n        .return_func\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_fake_add=function(){asm="\n    .init\n\n    .function function_add x y\n    .var sum 0\n    .add x y sum\n    .return_func sum\n    .end_function function_add\n\n    .function main\n    .var a 199\n    .var b 3\n    .call_function function_add a b\n\n    .load_return sum\n    .load sum a2\n\n    .return_func\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_multiply=function(){asm="\n    jump @1024\n    .memory 1024\n    set2 f1 3 ;一开始设置到栈顶\n    jump #main ;直接跳到main函数\n\n    .function function_multiply x y\n    .var i 0\n    .var sum 0\n\n    ;首先比较i和y的大小，目前比较大小只能用寄存器\n    ;目前左右运算符都需要在寄存器中使用\n    @while_start\n    .load i a1\n    .load y a2\n    compare a1 a2\n    jump_if_less @while_block\n    jump @while_end\n\n    @while_block\n    .add x sum sum\n    .add i 1 i\n    jump @while_start\n    @while_end\n\n    .return_func sum\n    .end_function function_multiply\n\n    .function main\n    .var a 30\n    .var b 3\n    .call_function function_multiply a b\n    .load_return sum\n    .load sum a2\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_same_var_name=function(){asm="\n    jump @1024\n    .memory 1024\n    set2 f1 3 ;一开始设置到栈顶\n    jump #main ;直接跳到main函数\n\n    .function func para\n    .var name 100\n    .return_func\n    .end_function func\n\n    .function main\n    .var para 10\n    .call_function func para\n\n    ; main函数不用做这步 .return_func\n\n    halt\n",output=machine_code(asm),log("output:",output)},asm_test_factorial=function(){asm="\n    jump @1024\n    .memory 1024\n    set2 f1 3 ;一开始设置到栈顶\n    jump #main ;直接跳到main函数\n\n    .function function_multiply x y\n    .var i 0\n    .var sum 0\n\n    ;首先比较i和y的大小，目前比较大小只能用寄存器\n    ;目前左右运算符都需要在寄存器中使用\n    @while_start\n    .load i a1\n    .load y a2\n    compare a1 a2\n    jump_if_less @while_block\n    jump @while_end\n\n    @while_block\n    .load x a1\n    .load sum a2\n    add2 a1 a2 a2\n    .assign a2 sum ;将计算的临时和放入sum\n\n    .load i a1\n    set2 a2 1\n    add2 a1 a2 a1\n    .assign a1 i\n    jump @while_start\n    @while_end\n\n    .return_func sum\n    .end_function function_multiply\n\n\n    .function main\n    .var a 30\n    .var b 3\n    .var ans 100\n\n    .add a b ans\n\n    .load ans a2\n    halt\n",output=machine_code(asm),log("output:",output)},test_asm=function(){asm_test_fake_add()};