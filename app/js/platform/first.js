//jQuery読む
window.jQuery = window.$ = require('../../js/common/jquery.js');
var Hammer = require('../../js/common/hammer.min.js');
$.strip_tags = function(str, allowed) {
	if(!str){
		return "";
	}
  	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || [])
  		.join('');
  	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
  		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  	return str.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
  		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  	});
  };
  function escapeHTML(str) {
	  if(!str){
		  return "";
	  }
	return str.replace(/&/g, '&amp;')
			  .replace(/</g, '&lt;')
			  .replace(/>/g, '&gt;')
			  .replace(/"/g, '&quot;')
			  .replace(/'/g, '&#039;');
  }
  //PHPのnl2brと同様
function nl2br(str) {
	if(!str){
		return "";
	}
    str = str.replace(/\r\n/g, "<br />");
	str = str.replace(/(\n|\r)/g, "<br />");
    return str;
}
function formattime(date){
	var str=date.getFullYear()+"-";
	if(date.getMonth()+1<10){
		str=str+"0"+(date.getMonth()+1)+"-";
	}else{
		str=str+(date.getMonth()+1)+"-";
	}
	if(date.getDate()<10){
		str=str+"0"+date.getDate()
	}else{
		str=str+date.getDate()
	}
	str=str+"T";
	if(date.getHours()<10){
		str=str+"0"+date.getHours()+":"
	}else{
		str=str+date.getHours()+":"
	}
	if(date.getMinutes()<10){
		str=str+"0"+date.getMinutes()
	}else{
		str=str+date.getMinutes()
	}
	return str;
}
function formattimeutc(date){
	var str=date.getUTCFullYear()+"-";
	if(date.getUTCMonth()+1<10){
		str=str+"0"+(date.getUTCMonth()+1)+"-";
	}else{
		str=str+(date.getUTCMonth()+1)+"-";
	}
	if(date.getUTCDate()<10){
		str=str+"0"+date.getUTCDate()
	}else{
		str=str+date.getUTCDate()
	}
	str=str+"T";
	if(date.getUTCHours()<10){
		str=str+"0"+date.getUTCHours()+":"
	}else{
		str=str+date.getUTCHours()+":"
	}
	if(date.getUTCMinutes()<10){
		str=str+"0"+date.getUTCMinutes()
	}else{
		str=str+date.getUTCMinutes()
	}
	return str;
}
var electron = require("electron");
var ipc = electron.ipcRenderer;
ipc.send('custom-css-request', "");
ipc.on('custom-css-response', function (event, arg) {
	if(arg==""){ return false; }
	var styleNode = document.createElement("style");
	styleNode.setAttribute("type","text/css")

	var content = document.createTextNode(arg)
	styleNode.append(content)
	document.getElementsByTagName("head")[0].append(styleNode)
})
ipc.on('theme-css-response', function (event, arg) {
	if(arg==""){ return false; }
	var styleNode = document.createElement("style");
	styleNode.setAttribute("type","text/css")

	var content = document.createTextNode(arg)
	styleNode.append(content)
	document.getElementsByTagName("head")[0].append(styleNode)
})
function makeCID(){
	return randomStr(8)+"-"+randomStr(4)+"-"+randomStr(4)+"-"+randomStr(4)+"-"+randomStr(12);
}
function randomStr(l){
	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
    	r += c[Math.floor(Math.random()*cl)];
	}
	return r;
}
function rgbToHex(color)
{
  // HEXに変換したものを代入する変数
  var hex = '';
  
  // 第1引数がHEXのとき変換処理は必要ないのでそのままreturn
  // IE8の場合はjQueryのcss()関数でHEXを返すので除外
  if (color.match(/^#[a-f\d]{3}$|^#[a-f\d]{6}$/i))
  {
    return color;
  }
  
  // 正規表現
  var regex = color.match(/^rgb\(([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)\)$/);
  
  // 正規表現でマッチしたとき
  if (regex)
  {
    var rgb =
    [
      // RGBからHEXへ変換
      parseInt(regex[1]).toString(16),
      parseInt(regex[2]).toString(16),
      parseInt(regex[3]).toString(16)
    ];
    
    for (var i = 0; i < rgb.length; ++i)
    {
      // rgb(1,1,1)のようなときHEXに変換すると1桁になる
      // 1桁のときは前に0を足す
      if (rgb[i].length == 1)
      {
        rgb[i] = '0' + rgb[i];
      }
      hex += rgb[i];
    }
    
    return hex;
  }
  
  console.error(color+':第1引数はRGB形式で入力');
}