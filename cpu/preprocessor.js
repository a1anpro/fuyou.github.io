var update_label_map = function(scope_map){
    var keys = Object.keys(scope_map)

    for (var j = 0; j < keys.length; ++j){
        var k = keys[j]
        scope_map[k] += 2
    }
    return scope_map
}

// 1: .var name 10
// 2: .load name reg
// 3: .assign reg name
// 4: .function function_name paras[]
// 5: .call_function function_name paras[]
// 6: .return_func
// 7: .push a1 或 .push name 或 .push 123
// 8: .pop


// 用来存局部变量的栈
// 结构：每个元素都是map{'function_name': 'name', 'scope': map}
var scopes = []

var get_scopes_top = function(){
    return scopes[scopes.length-1]
}

var del_scopes_top = function(){
    return scopes.pop()
}

var get_cur_scope = function(){
    var cur_frame = get_scopes_top() // 得到栈帧
    var cur_scope = cur_frame['scope'] // 得到当前作用域
    return cur_scope
}

var get_cur_func_name = function(){
    var cur_frame = get_scopes_top() // 得到栈帧
    var cur_func_name = cur_frame['function_name'] // 得到当前作用域
    return cur_func_name
}

// scopes的栈顶就是当前正在翻译的作用域
var dot_function = function(code){
    // .function function_name paras[]
    // 函数名
    var func_name = code[1]
    log('函数名:', func_name)

    var cur_frame = new Map() // 新建作用域
    cur_frame['function_name'] = func_name
    var cur_scope = new Map() // 当前作用域，在当前作用域中设置变量

    // 作用域入栈
    var ret = '#' + func_name

    // 处理参数列表
    var para_list = code.slice(2)

    for (var k = 0; k < para_list.length; ++k){
        var para = para_list[k]
        cur_scope[para] = 0
        update_label_map(cur_scope)
    }


    cur_frame['scope'] = cur_scope
    scopes.push(cur_frame)
    return ret
}

var dot_end_function = function(code){
    // 出栈 + 设置标记
    // .end_function function_name
    var func_name = code[1]
    var ret = '#end_' + func_name

    del_scopes_top() // 当前作用域结束了, 后面应该加上检查的方式，必须是闭合的
    return ret
}

var dot_var = function(code){
    // .var name 10
    var cur_scope = get_cur_scope()

    // 需要做判断
    if (code.length < 2){
        assert(false, '.var语法错误')
        return
    }
    var var_name = code[1]
    var var_data = 0

    if (cur_scope[var_name]!=null){
        assert(false, '变量已定义')
    }

    if (code.length == 3){
        var_data = code[2]
    }
    cur_scope[var_name] = 0
    var ret =
'set2 a3 ' + var_data +
`
save_from_register2 a3 f1
set2 a3 2
add2 f1 a3 f1
`
    // .var需要更新f1，所以对该frame进行刷新
    update_label_map(cur_scope)

    // log('scopes:', scopes)
    return ret
}

var dot_load = function(code){
    // .load name reg
    var cur_scope = get_cur_scope()
    var var_name = code[1]
    var reg = code[2]

    // 先把变量的偏移取出
    var offset = cur_scope[var_name]
    var ret =
'\nset2 a3 ' + offset +
`
subtract2 f1 a3 a3
`
+ 'load_from_register2 a3 ' + reg

    return ret
}

var dot_assign = function(code){
    // .assign reg name
    // assign 可以拓展很多
    var cur_scope = get_cur_scope() // 得到当前作用域
    var reg = code[1]
    var var_name = code[2]

    // 先把变量的偏移取出
    var offset = cur_scope[var_name]

    var ret =
'set2 a3 ' + offset +
`
subtract2 f1 a3 a3
`
+ 'save_from_register2 ' + reg + ' a3 '

    return ret
}

var dot_call_function = function(code){
    // .call_function function_name paras[]
    // 函数名
    var func_name = code[1]
    var para_list = code.slice(2)

    var cur_scope = get_cur_scope()

    // 统计字面量、变量
    var var_cnt = 0
    var const_cnt = 0
    for (var k = 0; k < para_list.length; ++k){
        if (isDigit(para_list[k])){
            const_cnt += 15
        } else {
            var_cnt += 22
        }
    }
    // 先计算返回的pa偏移位置
    var ret_offset = var_cnt + const_cnt + 14

    // 每调用一次f1的更新都需要刷新frame
    update_label_map(cur_scope)
    var ret =
'set2 a3 ' + ret_offset +
`
add2 pa a3 a3
save_from_register2 a3 f1
set2 a3 2
add2 f1 a3 f1
`
    for (var k = 0; k < para_list.length; ++k){
        if (isDigit(para_list[k])){
            const_cnt += 15
        } else {
            // 是变量
            var var_name = para_list[k]
            // 变量的偏移
            var var_offset = cur_scope[var_name]
            var temp =
'\nset2 a3 ' + var_offset +
`
subtract2 f1 a3 a3
load_from_register2 a3 a3
save_from_register2 a3 f1
set2 a3 2
add2 f1 a3 f1
`
            ret += temp
            // 每一步都需要更新偏移
            update_label_map(cur_scope)
        }
    }
    ret += 'jump ' + '#' + func_name

    log('scopes:', scopes)
    return ret
}

var dot_return_func = function(code){
    // .return_func
    // 无参数的话，则只退回所有变量占的空间+2
    // 将当前函数的所有变量删掉
    var cur_scope = get_cur_scope()

    var local_vars_cnt = Object.keys(cur_scope).length // 所有局部变量的个数，包括参数
    var f1_offset = local_vars_cnt * 2 // f1应该退回的数量, 再加上一个f1的位置

    var ret_var = null
    if (code.length >= 2){
        ret_var = code[1]
    }

    var ret = ''
    if (ret_var!=null){
        // 有返回值，先看返回变量在不在当前栈中,再栈中就取值
        if (cur_scope[ret_var] != null){
            // 由于我们是先把f1退回到存放返回值的位置，所以，f1先变了，那么变量的偏移肯定也需要变，
            // 现在的错误相当于变量被销毁了，找不到了
            // 而在这时，我们的a1或者a2是不用的， 于是我们先把返回值在销毁前保存到a1或者a2中
            var ret_var_offset = cur_scope[ret_var]
            ret =
'set2 a3 ' + ret_var_offset +
`
subtract2 f1 a3 a3
load_from_register2 a3 a1
` +
'set2 a3 ' + f1_offset +
`
subtract2 f1 a3 f1 ;f1退栈
` +
'save_from_register2 a1 f1' +
`
set2 a3 2
subtract2 f1 a3 f1 ;再移回到返回值位置
load_from_register2 f1 a3
jump_from_register a3
`
        }
    } else{
        // 没有变量的话，就直接退回
        // 如果是main函数则不用+2，main函数是最外层函数，不退栈
        var cur_func_name = get_cur_func_name()
        if (cur_func_name == 'main'){
            ret =
'set2 a3 ' + f1_offset +
`
subtract2 f1 a3 f1 ;f1退栈
`
        } else{
            f1_offset += 2
            ret =
'set2 a3 ' + f1_offset +
`
subtract2 f1 a3 f1 ;f1退栈
load_from_register2 f1 a3
jump_from_register a3
`
        }

    }
    return ret
}

var dot_load_return = function(code){
    // .load_return name
    // 将函数的返回值放入name
    var cur_scope = get_cur_scope()
    // 需要做判断
    if (code.length < 2){
        assert(false, '.load_return语法错误')
        return
    }
    var var_name = code[1]

    if (cur_scope[var_name]!=null){
        assert(false, 'load_return中变量未定义')
    }
    cur_scope[var_name] = 0
    var ret =
`
set2 a3 2
add2 f1 a3 a3
load_from_register2 a3 a3
save_from_register2 a3 f1 ;把值放到f1处
set2 a3 2
add2 f1 a3 f1
`
    update_label_map(cur_scope)
    return ret
}

var dot_add = function(code){
    // .add var1 var2 var3
    // var3必须是变量，var1和var2可能是字面量
    //由于该指令会用到其他伪指令，所以直接在其中调用即可
    if (code.length < 4){
        assert(false, 'add语法出错')
    }
    var cur_scope = get_cur_scope()

    var var1 = code[1]
    var var2 = code[2]
    var ans = code[3]
    var offset_ans = cur_scope[ans]

    var load_var1 = '' // 第1个参数的翻译
    var load_var2 = '' // 第2个参数的翻译
    if (isDigit(var1)){
        log('参数1是数字')
        load_var1 = '\nset2 a1 ' + var1 + '\n'
    } else {
        load_var1 = dot_load(('.load ' + var1 + ' a1').split(' '))
    }

    if (isDigit(var2)){
        log('参数2是数字')
        load_var2 = '\nset2 a2 ' + var2 + '\n'
    } else {
        load_var2 = dot_load(('.load ' + var2 + ' a2').split(' '))
    }

    var ret = load_var1 + load_var2
    ret +=
`
add2 a1 a2 a1
`
+
'set2 a3 ' + offset_ans +
`
subtract2 f1 a3 a3
save_from_register2 a1 a3
`

    return ret
}

var dot_init = function(code){
    var ret = `
jump @1024
.memory 1024
set2 f1 3 ;一开始设置到栈顶
jump #main ;直接跳到main函数
`
    return ret
}


var if_scopes = []
var dot_if = function(code){
    var lines = code.split('\n')
    var if_line = lines[0]

    var l = if_line.indexOf('(')
    var r = if_line.indexOf(')')
    var expr = if_line.slice(l+1, r)

    var codes = expr.split(' ')
    var left_reg = codes[0]
    var symbol = codes[1]
    var right_reg = codes[2]
    log(left_reg, symbol, right_reg)

    var i = 1
    // while (i < lines.length){
    //     if (lines[i].indexOf('.if') != -1){
    //         // 又有嵌套的.if
    //         process_if_while()
    //     }
    // }


    return code
}

///先翻译.if，成带有jump的作用域，其中可能有伪指令，再针对他们进行翻译
var process_if_while = function(asm_code){
    var asm_code = asm_code.split('\n')
    var i = 0
    var fake_code_lines = ''

    while (i < asm_code.length) {
        code = clear_line(asm_code[i])
        if (code.length != 0) {
            if (code.indexOf('.if') != -1) {
                // 包含.if的语句, 往下找到反花括号
                var if_codes = ''
                while (code.indexOf('}') == -1){
                    if_codes += code + '\n'
                    ++i
                    code = clear_line(asm_code[i])
                }
                var if_ret = dot_if(if_codes + '}\n')

                fake_code_lines += if_ret + '\n'
            } else{
                //其他语句直接往里面塞
                fake_code_lines += code + '\n'
            }
        }
        ++i
    }
    return fake_code_lines
}

var translate_fake_ins = function(asm_code){
    var ret = []
    var std_code = ''
    var asm_code = asm_code.split('\n')
    var i = 0

    while (i < asm_code.length) {
        code = clear_line(asm_code[i])
        if (code.length != 0) {
            // 如果是反括号，则判断if_scope是否为空，如果为空则判断while..
            //不为空则是if语句的作用域结尾，将if作用域出栈一个即可
            if (code[0] == '}'){
                if (if_scopes.length != 0){
                    if_scopes.pop()
                }
            }
            if (code[0] == '.' && code.indexOf('memory') == -1) {
                // 处理伪指令
                code = code.split(' ')
                fake_ins = code[0]
                // log('伪指令:', fake_ins)
                var real_code = ''

                if (fake_ins == '.call'){
                    real_code = `
set2 a3 14
add2 pa a3 a3
save_from_register2 a3 f1
set2 a3 2
add2 f1 a3 f1
jump ` + code[1]
                } else if (fake_ins == '.return'){
                    var offset = 2 +parseInt(code[1])
                    real_code =
'set2 a3 ' + offset + `
subtract2 f1 a3 f1
load_from_register2 f1 a3
jump_from_register a3 `
                }
                else if (fake_ins == '.var'){
                    real_code = dot_var(code)
                } else if (fake_ins == '.function'){
                    real_code = dot_function(code)
                } else if (fake_ins == '.load'){
                    real_code = dot_load(code)
                } else if (fake_ins == '.assign'){
                    real_code = dot_assign(code)
                } else if (fake_ins == '.end_function'){
                    real_code = dot_end_function(code)
                } else if (fake_ins == '.call_function'){
                    real_code = dot_call_function(code)
                } else if (fake_ins == '.return_func'){
                    real_code = dot_return_func(code)
                } else if (fake_ins == '.load_return'){
                    real_code = dot_load_return(code)
                } else if (fake_ins == '.add'){
                    real_code = dot_add(code)
                } else if (fake_ins == '.init'){
                    real_code = dot_init(code)
                } else if (fake_ins == '.if'){
                    real_code = dot_if(code)
                }

                std_code += real_code + '\n'
            } else {
                if (code.length != 0) {
                    std_code += code + '\n'
                }
            }
        }
        i++
    }
    // log('标准代码:\n', std_code)
    return std_code
}
