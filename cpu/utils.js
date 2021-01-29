const log = console.log.bind(console)
var  e = (id)=>document.querySelector(id)
const assert = console.assert.bind(console)

// 将一个data分成高8位和低8位
var apart_data = function(data){
    low = data & 0xff
    high = data >> 8 & 0xff
    ret = [low, high]
    return ret
}

// 将高8位和低8位合成为一个整数
var restore_from_little = function(low, high){
    // log('low, high:', low, high)
    data = low + (high << 8)
    return data
}

var read_low_8bit = function(data){
    return data & 0xff
}

var read_high_8bit = function(data){
    return data >> 8 & 0xff
}

var isArrayEqual = function(array1,array2) {
  return array1.length==array2.length && array1.every(function(v,i) { return v === array2[i]});
}

var isDigit = function(str){
    var ret = /^\d+$/.test(str)
    return ret
}

var fillZero = function(arr, size){
    return arr.concat(Array(size).fill(0))
}

var get_instructions = function(){
    d = {
        'set': 0b00000000,
        'load': 0b00000001,
        'add': 0b00000010,
        'save': 0b00000011,
        'compare': 0b00000100,
        'jump_if_less': 0b00000101,
        'jump': 0b00000110,
        'save_from_register': 0b00000111,

        'set2': 0b00001000,
        'load2': 0b00001001,
        'add2': 0b00001010,
        'save2': 0b00001011,
        'subtract2': 0b00001100,

        'load_from_register': 0b00001101,
        'load_from_register2': 0b00001110,
        'save_from_register2': 0b00001111,
        'jump_from_register': 0b00010000,
        'halt': 0b11111111,
    }
    return d
}

// 机器码到寄存器的映射
var get_reg_mapper = function(){
    mapper = {
        0b00000000: 'pa',
        0b00010000: 'a1',
        0b00100000: 'a2',
        0b00110000: 'a3',
        0b01000000: 'c1',
        0b01010000: 'f1',
    }
    return mapper
}

var get_registers = function(){
    d = {
        'pa': 0b00000000,
        'a1': 0b00010000,
        'a2': 0b00100000,
        'a3': 0b00110000,
        'c1': 0b01000000,
        'f1': 0b01010000,
    }
    return d
}
