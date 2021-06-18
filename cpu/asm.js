var clear_line=function(e){return e=e.trim(),i=e.indexOf(";"),-1!=i&&(e=e.slice(0,i)),e},pre_process=function(e){for(var i=[],s=(e=e.split("\n"),0);s<e.length;)code=clear_line(e[s]),0!=code.length&&(i=i.concat(code.split(" "))),s++;return i},isValidCode=function(e){return 0!=(e=e.trim()).length&&(";"!=e[0]&&"#"!=e[0]&&"@"!=e[0])},getValidCodeLines=function(e){for(var i=[],s=e.split("\n"),t=0;t<s.length;++t){var l=s[t];1==isValidCode(l)&&i.push(t)}return i},machine_code=function(e){var i=Assembler.new(e);return i.run(),i.get_machine_code()};class Assembler{constructor(e){this.source_code=e,this.asm_code=e,this.init(),this.mcode=[],this.mcode_lines=[],this.label_map=new Map,this.instructions=get_instructions(),this.registers=get_registers()}static new(e){return new this(e)}init(){this.valid_lines=getValidCodeLines(this.asm_code),this.line_index=0,this.std_code=translate_fake_ins(this.asm_code),this.asm_code=pre_process(this.std_code)}fillValidLine(e){var i=this.valid_lines[this.line_index];this.mcode_lines=this.mcode_lines.concat(Array(e).fill(i)),this.line_index+=1}get_std_code(){return this.std_code}get_machine_code(){return this.mcode}get_valid_lines(){return this.valid_lines}get_mcode_lines(){return this.mcode_lines}get_labelmap(){return this.label_map}run(){for(var e=0,i=this.label_map,s=new Map,t=this.asm_code,l=[],d=this.instructions,a=this.registers;e<t.length;)if(code=t[e].trim(),"set"==code||"set2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=t[e+2],h=parseInt(s),o=(h=apart_data(h))[0],n=h[1];"set"==code?(3,l.push(o),this.fillValidLine(3)):(4,l.push(o),l.push(n),this.fillValidLine(4)),e+=3}else if("load"==code||"load2"==code){l.push(d[code]);let i=t[e+1],s=parseInt(i.slice(1)),h=(s=apart_data(s))[0],o=s[1];"load"==code?(3,l.push(h),this.fillValidLine(3)):(4,l.push(h),l.push(o),this.fillValidLine(4));let n=a[t[e+2]];l.push(n),e+=3}else if("add"==code||"add2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s);let h=a[t[e+3]];l.push(h),e+=4,4,this.fillValidLine(4)}else if("save"==code||"save2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=t[e+2],h=parseInt(s.slice(1)),o=(h=apart_data(h))[0],n=h[1];"save"==code?(3,l.push(o),this.fillValidLine(3)):(4,l.push(o),l.push(n),this.fillValidLine(4)),e+=3}else if("compare"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s),e+=3,3,this.fillValidLine(3)}else if("jump_if_less"==code||"jump_if_great"==code||"jump"==code){l.push(d[code]);let i=t[e+1].slice(1);if(isDigit(i)){let e=parseInt(i),s=apart_data(e),t=s[0],d=s[1];l.push(t),l.push(d)}else s[t[e+1]]=!1,l.push(t[e+1]),l.push(0);e+=2,3,this.fillValidLine(3)}else if("save_from_register"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s),e+=3,3,this.fillValidLine(3)}else if("subtract2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s);let h=a[t[e+3]];l.push(h),e+=4,4,this.fillValidLine(4)}else if("load_from_register"==code||"load_from_register2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s),e+=3,3,this.fillValidLine(3)}else if("save_from_register2"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i);let s=a[t[e+2]];l.push(s),e+=3,3,this.fillValidLine(3)}else if("jump_from_register"==code){l.push(d[code]);let i=a[t[e+1]];l.push(i),e+=2,2,this.fillValidLine(2)}else if(-1!=code.indexOf("@")||-1!=code.indexOf("#")){let s=l.length;i.set(code,s),e+=1}else if(".memory"==code){let i=parseInt(t[e+1])-l.length;l=fillZero(l,i),i,e+=2,this.fillValidLine(i)}else"halt"==code?(l.push(d[code]),1,e+=1,this.fillValidLine(1)):e++;for(e=0;e<l.length;++e)if(i.has(l[e])){s[l[e]]=!0;var h=i.get(l[e]);h=apart_data(h),l[e]=h[0],l[e+1]=h[1]}var o=Object.keys(s);for(e=0;e<o.length;++e){var n=o[e];0==(h=s[n])&&(l=[n+"未定义"])}this.mcode=l}}
