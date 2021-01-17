window.breakpoints = {}

var asmEditor = CodeMirror.fromTextArea(e("#asm_code"), {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    styleSelectedText: true,
    styleActiveSelected: true,
    gutters: ["breakpoints", "CodeMirror-linenumbers"],
    mode: "text/x-z80",
    matchBrackets: true,
    autoCloseBrackets: true
    });

    // 机器码显示区域，不可修改
var mcodeEditor = CodeMirror.fromTextArea(e("#machine_code"), {
    mode: "text/x-z80",
    readOnly: true,
    lineWrapping: true,
    lineNumbers: true
    })

asmEditor.setSize("auto", 600);
mcodeEditor.setSize("auto", 500);

// 点击产生断点
asmEditor.on("gutterClick", function(editor, line, gutter, event){
    var info = editor.lineInfo(line)
    // log('产生断点', line)
    // log('line info:', info)
    // log('editor:', editor)
    // log('line:', line)
    // 如果有红点了则取消
    // log('guttermarker:', info.gutterMarkers)
    // gutterMarkers是info的属性
    if (info.gutterMarkers != undefined){
        clearGutter(editor, line)
    } else{
        setGutter(editor, line)
    }
})

// 清除断点
var clearGutter = function(editor, line){
    // 删除该全局的断点
    delete window.breakpoints[line]
    editor.setGutterMarker(line, "breakpoints", null)
}
// 标记断点
var setGutter = function(editor, line){
    // 设置全局的断点
    window.breakpoints[line] = true
    var marker = getGutterMarker()
    editor.setGutterMarker(line, "breakpoints", marker)
}
// 得到断点的模板
var getGutterMarker = function(){
    var marker = document.createElement("div")
    marker.style.color = "blue"
    marker.innerHTML = "&nbsp▶ " //
    return marker
}

var showStdCode = function(area, std_code){
    area.setValue(std_code)
}

var showMachineCode = function(area, mcode){
    var value = ""
    var b = ""
    for (var i = 0; i < mcode.length; ++i){
        let m = mcode[i]
        // log('m:', m)
        let bin = parseInt(m).toString(2)
        let cnt = 8 - bin.length
        for (let i = 0; i < cnt; ++i){
            bin = "0" + bin
        }
        b = b + bin + '\n'
        let show = bin + "\t(" + m + ")"
        value = value + show + "\n"
    }
    // log(b)
    area.setValue(value)
}

var success_highlight = function(editor, line) {
    // editor.setCursor(line)
    // log('highlight,', line, editor)
    editor.addLineClass(line, "wrap", "success-highlight-background")
}
var highlight = function(editor, line) {
    // log('高亮:',editor, line)
    // editor.setCursor(line)
    // log('highlight,', line, editor)
    editor.addLineClass(line, "wrap", "highlight-background")
}
var remove_highlight = function(editor, line) {
    // log('移除高亮,', line)
    editor.removeLineClass(line, "wrap", "highlight-background")
}
var select = function(editor, line) {
    editor.setCursor(line)
    // log('select,', line, editor)
    editor.addLineClass(line, "wrap", "highlight-background")
}


var asm_code = `
jump @1024
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

asmEditor.setValue(asm_code)
// 全局的行号和机器码
var code_memory = []
// pa的最大范围, 由于pa是程序计数器，所以只会指向代码段
var code_length = 0
var mcode_lines = []

var label_map = null
var running = false

var pa = null
var axepu = null
var debug_mode = false
var find_breakpoint = false
var finished = false

// 运行时的寄存器和内存，一直刷新
var registers = null
var memory = null
var memory_table = e('.memory-table')

var change_editor = function(){
    // 改成执行标准汇编
    var asm_code = asmEditor.getValue()
    // var asm_code = asmEditor.getValue()

    var asm = Assembler.new(asm_code)
    asm.run()
    // 机器码
    code_memory = asm.get_machine_code()
    log('code_memory:\n', code_memory.slice(1024))
    // 标准汇编
    std_code = asm.get_std_code()

    code_length = code_memory.length
    mcode_lines = asm.get_mcode_lines() // 得到机器码对应于汇编码的行数

    label_map = asm.get_labelmap()
    // 将翻译好的机器码按格式显示
    // showMachineCode(mcodeEditor, code_memory)
    showStdCode(mcodeEditor, std_code)
}

// 编辑完asmEditor则执行汇编器,不应该用update
asmEditor.on("change", function(){
    change_editor()
})

 // 点击运行按钮
e('#run-button').onclick = function(){
    // 检查代码不为空且无错误
    log('点击运行')

    // 点击运行的时候检查是否为debug模式
    if (has_breakpoints()){
        debug_mode = true
    }
    // 只有点运行才可以启动
    axepu = new AxePu(code_memory)
    // 初始化
    pa = 0
    running = true

    if (debug_mode == true) {
        // 如果是debug模式，则停止运行，因为pa是停止的，只要改变running的状态即可
        //运行到断点处停下
        while (pa < mcode_lines.length){
          for (var p in window.breakpoints){
              // log('p, pa:', p, mcode_lines[pa])
              if (p == mcode_lines[pa]){
                  find_breakpoint = true
                  break
              }
          }
          if (find_breakpoint){
              break
          }
          axepu.do_next_ins()
          // 执行一行更新pa
          pa = axepu.get_register('pa')
        }
    }
}

// 点击下一步
e('#next-button').onclick = function(){
    // log('点击下一步')
    if (running == true){
        update_table()
        run_next()
    }
}

// 点击停止按钮
e('#stop-button').onclick = function(){
   log('点击停止')
   // 初始化
   running = false
}

// 点击重置按钮
e('#reset-button').onclick = function(){
    change_editor()
    running = false
    pa = null
    axepu = null
    debug_mode = false
    find_breakpoint = false
    finished = false

    reset_all()
    // 去除所有断点
    // var keys = Object.keys(window.breakpoints)
    // for (var i = 0; i < keys.length; ++i){
    //     var line = keys[i]
    //     log('去除断点:', line)
    //     clearGutter(asmEditor, line)
    // }
}

// 点击跳过按钮
e('#continue-button').onclick = function(){
    // 从当前断点执行到下一个断点
    var asm_pa = mcode_lines[pa]
    var keys = Object.keys(window.breakpoints)

    // 跳到的位置是：第一个比当前asm_pa大的断点处
    var tag = asm_pa
    for (var i = 0; i < keys.length; ++i){
        if (tag < keys[i]){
            tag = keys[i]
            break
        }
    }
    log('下一个断点:', tag)
    while (asm_pa < tag){
        run_next()
        asm_pa = mcode_lines[pa]
    }
}

var has_breakpoints = function(){
    for (var p in window.breakpoints){
        return true
    }
    return false
}

var reset_all = function(){
    log('重置所有')
    clear_registers_table()
    clear_memory_table()

    clear_all_highlight()
}

var clear_registers_table = function(){
    var nodelist = e('#registers-tr').children
    for (var i = 0; i < nodelist.length; ++i) {
        var item = nodelist[i]
        item.innerHTML = 0
    }
}

var clear_memory_table = function(){
    var memory_table = e('.memory-table')
    var len = memory_table.rows.length - 1  // 减去标题
    for (var i = 0; i < len; ++i) {
        var row = memory_table.rows[i+1]
        row.cells[0].removeAttribute('style')
        row.cells[1].innerHTML = 0
    }
}

var update_registers_table = function(){
    // log('update_registers')
    if (axepu != null){
        // 只要虚拟机运行了，就有寄存器了
        var registers = axepu.get_all_registers()
        var nodelist = e('#registers-tr').children
        var keys = Object.keys(registers)
        // log('keys:', keys)
        for (var i = 0; i < keys.length; ++i) {
          var k = keys[i]
          var item = nodelist[i]
          item.innerHTML = registers[k]
        }
    } else {

    }
}

var update_memory_table = function(){
    // 不应该每次都重新获取对象刷新，应该是获取新内存然后修改值
    // 刷新内存表格
    if (axepu != null){
        // 只要虚拟机运行了，就有内存了
        // 更新f1的位置
        var f1 = parseInt(registers['f1'])
        // 表格要显示的内容是系统栈的内容，所以，直接指定死就可以了
        var stack_segment = memory.slice(0, 1024)
        //不应该是在其中增加，应该是修改
        for (var i = 0; i < stack_segment.length; ++i) {
            var addr = i
            var data = stack_segment[i]

            var row = memory_table.rows[i+1]
            if (f1 == i){
                row.cells[0].setAttribute('style', 'background-color: red;')
            } else{
                row.cells[0].removeAttribute('style')
            }
            row.cells[0].innerHTML = addr
            row.cells[1].innerHTML = data
        }
    } else {
    }
}

var highligh_current_line = function(){
    // pa是当前行，除了pa以外其他都remove
    if (running == true){
        for (var i = 0; i < mcode_lines.length; ++i){
            remove_highlight(asmEditor, mcode_lines[i])
            remove_highlight(mcodeEditor, i)
        }
        if (pa < mcode_lines.length){
            highlight(asmEditor, mcode_lines[pa])
            highlight(mcodeEditor, pa)
        }
    }
}

var clear_all_highlight = function(){
    for (var i = 0; i < mcode_lines.length; ++i){
        remove_highlight(asmEditor, mcode_lines[i])
        remove_highlight(mcodeEditor, i)
    }
}

var finish_process = function(){
    log('执行完成的pa:', pa)
    var line = pa-1
    log('有效代码:', mcode_lines)
    success_highlight(asmEditor, mcode_lines[line])
    success_highlight(asmEditor, line)
}

var run_next = function(){
    axepu.do_next_ins()
    pa = axepu.get_register('pa')
    // log('pa:', pa, code_length)
    if (pa >= mcode_lines.length){
        running = false
        axepu = null
        log('结束')
    }
}

var update_mem_reg = function(){
    if (axepu != null && running){
        registers = axepu.get_all_registers()
        memory = axepu.get_memory()
    }
}

var update_table = function(){
    update_registers_table()
    // 刷新内存显示就 会耗时
    update_memory_table()
    // 高亮当前行
    highligh_current_line()
}

// 需要用计时器来做监听，一旦鼠标点击的状态变了则更改运行状态
setInterval(function(){

    // 更新寄存器表格
    if (running == true){
        update_mem_reg()
        update_table()


        if (debug_mode == false){
            run_next()
        }
    }


}, 1000/30)

 // 下一步按钮
 // 跳过按钮
 // 停止按钮
 // 重置按钮
