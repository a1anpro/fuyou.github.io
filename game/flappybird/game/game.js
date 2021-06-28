"use strict";function _construct(t,e,n){return(_construct=_isNativeReflectConstruct()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);i=new(Function.bind.apply(t,i));return n&&_setPrototypeOf(i,n.prototype),i}).apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}var Game=function(){function o(t,e,n){_classCallCheck(this,o),window.fps=t,this.images=e,this.runCallback=n,this.scene=null,this.actions={},this.keydowns={},this.canvas=document.querySelector("#id-canvas"),this.context=this.canvas.getContext("2d");var i=this;window.addEventListener("keydown",function(t){i.keydowns[t.key]="down"}),window.addEventListener("keyup",function(t){i.keydowns[t.key]="up"}),this.init()}return _createClass(o,[{key:"init",value:function(){for(var i=this,o=0,s=Object.keys(i.images),t=0;t<s.length;t++)!function(t){var e=s[t],t=i.images[e],n=new Image;n.src=t,n.onload=function(){i.images[e]=n,++o==s.length&&i._start()}}(t)}},{key:"_start",value:function(){this.runCallback(this)}},{key:"registerAction",value:function(t,e){this.actions[t]=e}},{key:"drawImage",value:function(t){this.context.drawImage(t.texture,t.x,t.y)}},{key:"imageByName",value:function(t){t=this.images[t];return{w:t.width,h:t.height,image:t}}},{key:"textureByName",value:function(t){return this.images[t]}},{key:"replaceScene",value:function(t){this.scene=t}},{key:"update",value:function(){this.scene.update()}},{key:"draw",value:function(){this.scene.draw()}},{key:"runloop",value:function(){for(var t=Object.keys(this.actions),e=0;e<t.length;e++){var n=t[e],i=this.keydowns[n];"down"==i?this.actions[n]("down"):"up"==i&&(this.actions[n]("up"),this.keydowns[n]=null)}this.update(),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.draw();var o=this;setTimeout(function(){o.runloop()},1e3/window.fps)}},{key:"runWithScene",value:function(t){var e=this;e.scene=t,setTimeout(function(){e.runloop()},1e3/window.fps)}}],[{key:"instance",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return this.i=this.i||_construct(this,e),this.i}}]),o}();