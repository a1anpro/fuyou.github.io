"use strict";var navConfig=[{title:"Resume",href:"resume",children:[]},{title:"Asm IDE",href:"asm",children:[]},{title:"CG",href:"cg",children:[]},{title:"Projects",href:"projects",children:[{title:"智能小车",href:"projects/bots"}]},{title:"Game",href:"game",children:[{title:"FlappyBird",href:"game/flappybird"},{title:"Popstar",href:"game/popstar"},{title:"MineSweeper",href:"game/mineSweeper"}]}],genCell=function(e,n){return'<a href="#/'.concat(e,'">').concat(n,"</a>")},genSecondMenu=function(e){for(var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],t="",c=0;c<n.length;c+=1){var r=n[c];t+="".concat(genCell(r.href,r.title),"\n")}return'<ul style="display: none" class="'.concat(e,'-dropdown">\n            <li class="second-menu">\n                ').concat(t,"\n            </li>\n        </ul>")},genFirstMenu=function(e){for(var n=0;n<e.length;n+=1){var t=e[n],c=0!==t.children.length,r="#/".concat(t.href),a='<a class="'.concat(t.href,'" href=').concat(r,">").concat(t.title,"</a>");c&&(a='<a class="'.concat(t.href,' has-dropdown" onclick="javascript:void(0)" href=').concat(r,">").concat(t.title,"</a>")),$(".list").append(a),c&&(t=genSecondMenu(t.href,t.children),$(".nav-bar").append(t))}},clearAllDropdown=function(){$(".list").children().each(function(e,n){n=(n=$(n)).attr("href").slice(2),n=$(".".concat(n,"-dropdown"));n[0]&&n.css("display","none")})},bindNavEvents=function(){$(".list").children().each(function(e,n){var t=(n=$(n)).attr("href").slice(2);n.bind("mouseenter",function(e){clearAllDropdown();var n=$(".".concat(t,"-dropdown"));n[0]&&"none"===n[0].style.display&&n.css("display","inline-block")}),$(".nav-bar").bind("mouseleave",function(){var e=$(".".concat(t,"-dropdown"));e[0]&&"none"!==e[0].style.display&&e.css("display","none")})})},_config=function(){genFirstMenu(navConfig),bindNavEvents()};_config();