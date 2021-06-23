"use strict";function _classCallCheck(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,i){for(var s=0;s<i.length;s++){var t=i[s];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function _createClass(e,i,s){return i&&_defineProperties(e.prototype,i),s&&_defineProperties(e,s),e}var clear_line=function(e){return e=e.trim(),i=e.indexOf(";"),e=-1!=i?e.slice(0,i):e},pre_process=function(e){for(var i=[],e=e.split("\n"),s=0;s<e.length;){var t=clear_line(e[s]);0!=t.length&&(i=i.concat(t.split(" "))),s++}return i},isValidCode=function(e){return 0!=(e=e.trim()).length&&(";"!=e[0]&&"#"!=e[0]&&"@"!=e[0])},getValidCodeLines=function(e){for(var i=[],s=e.split("\n"),t=0;t<s.length;++t){var n=s[t];1==isValidCode(n)&&i.push(t)}return i},machine_code=function(e){e=Assembler.new(e);return e.run(),e.get_machine_code()},Assembler=function(){function i(e){_classCallCheck(this,i),this.source_code=e,this.asm_code=e,this.init(),this.mcode=[],this.mcode_lines=[],this.label_map=new Map,this.instructions=get_instructions(),this.registers=get_registers()}return _createClass(i,[{key:"init",value:function(){this.valid_lines=getValidCodeLines(this.asm_code),this.line_index=0,this.std_code=translate_fake_ins(this.asm_code),this.asm_code=pre_process(this.std_code)}},{key:"fillValidLine",value:function(e){var i=this.valid_lines[this.line_index];this.mcode_lines=this.mcode_lines.concat(Array(e).fill(i)),this.line_index+=1}},{key:"get_std_code",value:function(){return this.std_code}},{key:"get_machine_code",value:function(){return this.mcode}},{key:"get_valid_lines",value:function(){return this.valid_lines}},{key:"get_mcode_lines",value:function(){return this.mcode_lines}},{key:"get_labelmap",value:function(){return this.label_map}},{key:"run",value:function(){for(var e=0,i=this.label_map,s=new Map,t=this.asm_code,n=[],l=this.instructions,a=this.registers;e<t.length;){var r,h,u,o,p,d,c,_,f,m=t[e].trim();"set"==m||"set2"==m?(n.push(l[m]),h=a[t[e+1]],n.push(h),r=t[e+2],h=parseInt(r),r=(h=apart_data(h))[0],h=h[1],"set"==m?(n.push(r),this.fillValidLine(3)):(n.push(r),n.push(h),this.fillValidLine(4)),e+=3):"load"==m||"load2"==m?(n.push(l[m]),r=t[e+1],h=parseInt(r.slice(1)),r=(h=apart_data(h))[0],h=h[1],"load"==m?(n.push(r),this.fillValidLine(3)):(n.push(r),n.push(h),this.fillValidLine(4)),h=a[t[e+2]],n.push(h),e+=3):"add"==m||"add2"==m?(n.push(l[m]),u=a[t[e+1]],n.push(u),o=a[t[e+2]],n.push(o),u=a[t[e+3]],n.push(u),e+=4,this.fillValidLine(4)):"save"==m||"save2"==m?(n.push(l[m]),o=a[t[e+1]],n.push(o),u=t[e+2],o=parseInt(u.slice(1)),u=(o=apart_data(o))[0],o=o[1],"save"==m?(n.push(u),this.fillValidLine(3)):(n.push(u),n.push(o),this.fillValidLine(4)),e+=3):"compare"==m?(n.push(l[m]),p=a[t[e+1]],n.push(p),p=a[t[e+2]],n.push(p),e+=3,this.fillValidLine(3)):"jump_if_less"==m||"jump_if_great"==m||"jump"==m?(n.push(l[m]),p=t[e+1].slice(1),isDigit(p)?(p=parseInt(p),p=(d=apart_data(p))[0],d=d[1],n.push(p),n.push(d)):(s[t[e+1]]=!1,n.push(t[e+1]),n.push(0)),e+=2,this.fillValidLine(3)):"save_from_register"==m?(n.push(l[m]),d=a[t[e+1]],n.push(d),d=a[t[e+2]],n.push(d),e+=3,this.fillValidLine(3)):"subtract2"==m?(n.push(l[m]),c=a[t[e+1]],n.push(c),c=a[t[e+2]],n.push(c),c=a[t[e+3]],n.push(c),e+=4,this.fillValidLine(4)):"load_from_register"==m||"load_from_register2"==m?(n.push(l[m]),c=a[t[e+1]],n.push(c),c=a[t[e+2]],n.push(c),e+=3,this.fillValidLine(3)):"save_from_register2"==m?(n.push(l[m]),_=a[t[e+1]],n.push(_),_=a[t[e+2]],n.push(_),e+=3,this.fillValidLine(3)):"jump_from_register"==m?(n.push(l[m]),_=a[t[e+1]],n.push(_),e+=2,this.fillValidLine(2)):-1!=m.indexOf("@")||-1!=m.indexOf("#")?(f=n.length,i.set(m,f),e+=1):".memory"==m?(f=parseInt(t[e+1])-n.length,n=fillZero(n,f),e+=2,this.fillValidLine(f)):"halt"==m?(n.push(l[m]),e+=1,this.fillValidLine(1)):e++}for(e=0;e<n.length;++e)i.has(n[e])&&(s[n[e]]=!0,v=i.get(n[e]),v=apart_data(v),n[e]=v[0],n[e+1]=v[1]);for(var g=Object.keys(s),e=0;e<g.length;++e){var v,V=g[e];0==(v=s[V])&&(n=[V+"未定义"])}this.mcode=n}}],[{key:"new",value:function(e){return new this(e)}}]),i}();