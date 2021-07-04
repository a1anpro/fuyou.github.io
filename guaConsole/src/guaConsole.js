"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var _require=require("../utils"),e=_require.e,ensure=_require.ensure,log=_require.log,equals=_require.equals,isArray=_require.isArray,isObject=_require.isObject,es=_require.es,EventEmitter=require("events").EventEmitter,container=e("#id-div-log"),templateStyle=function(e){return"\n    <style>\n        .number {\n            color: blue;\n        }\n        .string {\n            color: brown;\n        }\n        .hidden {\n            display: none;\n        }\n        .pointer {\n            cursor: pointer;\n        }\n        .pointer-img {\n            margin-right: 4px;\n            width: 8px;\n            bottom: 1px;\n            position: relative;\n        }\n        .bar {\n            display: inline-block;\n            width: 90px;\n            height: 30px;\n            text-align: center;\n            vertical-align: middle;\n            line-height: 32px;\n            color: #6b6666;\n        }\n        .bar-selected {\n            border-bottom: 2px solid #558ceff0;\n        }\n        .bar-unselected {\n            border-bottom: 2px solid #d3d3d34f;\n        }\n        .nav-bar {\n            background-color: #d3d3d34f;\n            border-bottom: 1px solid #b5b3b3e6;\n            margin-bottom: 5px;\n        }\n        .bar-hover {\n            background-color: #e2e1e1;\n        }\n        .expand-button {\n            cursor: pointer;\n            float: right;\n            border: 1px solid lightblue;\n            border-radius: 6px;\n            padding: 5px;\n            background-color: lightyellow;\n            margin: 3px;\n        }\n    </style>\n    "},insertStyle=function(){var e=templateStyle();document.head.insertAdjacentHTML("beforeend",e)},logChar=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"black",t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:container,a=document.createElement("span");a.innerHTML=e,a.setAttribute("style","color: ".concat(n)),t.appendChild(a)},logNumber=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=document.createElement("span");t.innerHTML=e,t.setAttribute("class","number"),n.appendChild(t)},logString=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=document.createElement("span");t.innerHTML='"'.concat(e,'"'),t.setAttribute("class","string"),n.appendChild(t)},logNewLine=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:container,n=document.createElement("hr");e.appendChild(n)},logValue=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=2<arguments.length?arguments[2]:void 0,a=_typeof(e);"number"===a?logNumber(e,n,"span"):"string"===a?logString(e,n):isArray(e)?logArray(e,n,t):isObject(e)&&logObject(e,n,t)},getDiv=function(){var e=document.createElement("div");return e.setAttribute("data-expand",!0),e.setAttribute("style","background-color: red; height: 100px;"),e},getImg=function(){var e=document.createElement("img");return e.src="http://localhost:63342/guaConsole/src/static/right.png",e},setImgSrc=function(e,n){e.src="http://localhost:63342/guaConsole/src/static/".concat(n,".png")},logExpandLine=function(e,n){var t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:container,a=3<arguments.length&&void 0!==arguments[3]&&arguments[3],r=document.createElement("div");logChar(e,a?"plum":"purple",r),logChar(": ","black",r),logValue(n,r,"span"),t.appendChild(r)},logProtoLine=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=document.createElement("div");logChar("__proto__","plum",t),logChar(": ","black",t),isArray(e)?logChar("Array(0)","black",t):isObject(e)&&logChar("Object","black",t),n.appendChild(t)};window.debug=!1;var expandedArrayDiv=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=document.createElement("div");t.setAttribute("data-expand",!0),t.setAttribute("id","test");for(var a=n,r=1;"id-div-log"!==a.id&&"HTML"!==a.tagName;){if(a.dataset.hasOwnProperty("expand")&&(log("层级+1"),20<=(r+=1))){log("不展开了");break}if(window.debug&&log("parent更新前",a),a=a.parentElement,window.debug&&log("parent更新后",a),!a)break}t.setAttribute("style","text-indent: ".concat(30*r,"px"));for(var o=0;o<e.length;o++){var i=e[o];logExpandLine(o,i,t)}return logExpandLine("length",e.length,t,!0),logProtoLine(e,t),t},expandedObjectDiv=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=document.createElement("div");t.setAttribute("data-expand",!0),t.setAttribute("id","test");for(var a=n,r=1;"id-div-log"!==a.id&&"HTML"!==a.tagName;)a.dataset.hasOwnProperty("expand")&&(r+=1),a=a.parentNode;t.setAttribute("style","text-indent: ".concat(30*r,"px"));for(var o=Object.keys(e),i=0;i<o.length;i++){var l=o[i],d=e[l];logExpandLine(l,d,t)}return logProtoLine(e,t),t},expandDom=function(e,n,t){for(var a=null,r=0;r<e.childNodes.length;r++){var o=e.childNodes[r];if(o.dataset.expand){a=o;break}}a?a.classList.contains("hidden")?(setImgSrc(t,"down"),a.classList.remove("hidden")):(setImgSrc(t,"right"),a.classList.add("hidden")):(t=expandedArrayDiv(n,e),isObject(n)&&(t=expandedObjectDiv(n,e)),e.appendChild(t))},logArray=function(n){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=(t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"div")||"div",a=document.createElement(t);a.setAttribute("id","expandable-dom");var r=getImg();r.classList.add("pointer"),r.classList.add("pointer-img"),r.addEventListener("click",function(e){setImgSrc(r,"down"),expandDom(a,n,r)});t=new EventEmitter;t.on("expandArray",function(){setImgSrc(r,"down"),expandDom(a,n,r)}),r.expandEvent=t,a.appendChild(r);var o=document.createElement("span");o.setAttribute("style","font-style: italic;"),logChar("(".concat(n.length,") "),"black",o),logChar("[","black",o);for(var i=0;i<n.length;i++){var l=n[i];isArray(l)?logChar("Array(".concat(l.length,")"),"black",o):isObject(l)?logChar("{...}","black",o):logValue(l,o),i!==n.length-1&&logChar(", ","black",o)}logChar("]","black",o),a.appendChild(o),e.appendChild(a),window.debug&&(setImgSrc(r,"down"),expandDom(a,n,r))},logObject=function(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:container,t=(t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"div")||"div",a=document.createElement(t);a.setAttribute("id","expandable-dom");var r=getImg();r.classList.add("pointer"),r.classList.add("pointer-img"),r.addEventListener("click",function(e){setImgSrc(r,"down"),expandDom(a,n,r)});t=new EventEmitter;t.on("expandObject",function(){setImgSrc(r,"down"),expandDom(a,n,r)}),r.expandEvent=t,a.appendChild(r);var o=document.createElement("span");o.setAttribute("style","font-style: italic;"),logChar("{","black",o);for(var i=Object.keys(n),l=0;l<i.length;l++){var d=i[l],c=n[d];logChar(d,"block",o),logChar(": ","block",o),isArray(c)?logChar("Array(".concat(c.length,")"),"black",o):isObject(c)?logChar("{...}","black",o):logValue(c,o),l!==i.length-1&&logChar(", ","block",o)}logChar("}","black",o),a.appendChild(o),e.appendChild(a)},navBarSpan=function(e){var n=1<arguments.length&&void 0!==arguments[1]&&arguments[1],t=document.createElement("span");return t.classList.add("bar"),n?t.classList.add("bar-selected"):t.classList.add("bar-unselected"),t.innerHTML=e,t.addEventListener("mouseover",function(){for(var e=t.parentNode.childNodes,n=0;n<e.length;n++)e[n].classList.remove("bar-hover");t.classList.add("bar-hover")}),t},drawNavBar=function(){var t=document.createElement("nav");t.classList.add("nav-bar"),t.addEventListener("mouseleave",function(){for(var e=t.childNodes,n=0;n<e.length;n++)e[n].classList.remove("bar-hover")}),t.appendChild(navBarSpan("Elements")),t.appendChild(navBarSpan("Network")),t.appendChild(navBarSpan("Console",!0)),t.appendChild(navBarSpan("Sources")),container.appendChild(t)},autoExpand=function e(n){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"all";if(n.dataset.hasOwnProperty("expand"))for(var a=0;a<n.children.length;a++)e(n.children[a]);else for(var r=0;r<n.children.length;r++){var o,i=n.children[r];"expandable-dom"!==i.id||(o=i.querySelector("img")).expandEvent&&(["expandArray"].includes(Object.keys(o.expandEvent._events)[0])&&["all","array"].includes(t)&&(o.expandEvent.emit("expandArray"),e(i.children[2])),["expandObject"].includes(Object.keys(o.expandEvent._events)[0])&&["all","object"].includes(t)&&(o.expandEvent.emit("expandObject"),e(i.children[2])))}},drawExpandButton=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"all",t=document.createElement("button");t.innerText=e,t.classList.add("expand-button"),t.addEventListener("click",function(){autoExpand(container,n)}),container.appendChild(t)},init=function(){insertStyle(),drawNavBar(),drawExpandButton("展开数组","array"),drawExpandButton("展开对象","object"),drawExpandButton("展开所有","all")},test=function(){logValue(1),logNewLine(),logValue("gua"),logNewLine(),logValue([1,2]),logNewLine(),logValue([1,2,"gua"]),logNewLine(),logValue({name:"gua",height:169}),logNewLine(),logValue({name:"gua",height:169,test:[1,2,3],test1:{name:"axe3"}}),logNewLine(),logValue([1,2,"gua",{name:"axe3"}]),logNewLine(),logValue([1,2,[3,4,5,[6,7,8]]]),logNewLine()},testLoopRef=function(){var e={name:"gua"};e.p={height:169,p:e},log(e),logValue(e)},guaConsole=function(){init();for(var e=0;e<arguments.length;e++)logValue(e<0||arguments.length<=e?void 0:arguments[e]),logNewLine()};module.exports={guaLog:guaConsole};