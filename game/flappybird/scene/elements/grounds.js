"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}var Grounds=function(){function r(e){_classCallCheck(this,r),this.game=e,this.stop=!1,this.skipCount=5,this.grounds=[];for(var t=0;t<30;t++){var n=YanImage.new(e,"ground");n.x=20*t,n.y=520,this.grounds.push(n)}}return _createClass(r,[{key:"allStop",value:function(){this.stop=!0}},{key:"update",value:function(){if(!this.stop){var e=-5;this.skipCount--,0==this.skipCount&&(this.skipCount=4,e=15);for(var t=0;t<30;t++)this.grounds[t].x+=e}}},{key:"draw",value:function(){for(var e=0;e<this.grounds.length;e++){var t=this.grounds[e];this.game.drawImage(t)}}}],[{key:"new",value:function(e){return new this(e)}}]),r}();