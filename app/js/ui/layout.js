//レイアウトの設定

var websocketOld = [];
var websocket = [];
var websocketHome = [];
var websocketLocal = [];
var websocketNotf = [];

//カラム追加ボックストグル
function addToggle() {
	$("#add-box").toggleClass("hide");
	addselCk()
	$("#add-box").css("bottom","40px");
	$("#add-box").css("left",$('#add-tgl').offset().left-$('#add-box').width()/2+"px");
	$("#add-box").toggleClass("show");
}
//最初、カラム変更時に発火
function parseColumn() {
	console.log("parse");
	var size = localStorage.getItem("size");
	if (size) {
		$("#timeline-container").css("font-size", size + "px");
		$(".toot-reset").css("font-size", size + "px");
		$(".cont-series").css("font-size", size + "px");
	}
	tlCloser();
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);

		var templete;
		Object.keys(obj).forEach(function(key) {
			var acct = obj[key];
			localStorage.setItem("name_" + key, acct.name);
			localStorage.setItem("user_" + key, acct.user);
			localStorage.setItem("user-id_" + key, acct.id);
			localStorage.setItem("prof_" + key, acct.prof);
			localStorage.setItem("domain_" + key, acct.domain);
			localStorage.setItem("acct_"+ key + "_at", acct.at);
			notf(key, 0);
			ckdb(key);
			//フィルターデータ読もう
			getFilter(key);
		});
	}
	var acctlist=obj;
	console.log(obj);
	var xed=localStorage.getItem("xed");
	if(xed){
		xpand();
	}
	var col = localStorage.getItem("column");
	if (!col) {
		var obj = [{
			domain: 0,
			type: 'local'
		}];
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	} else {
		var obj = JSON.parse(col);
	}
	if ($("#timeline-container").length) {
		$("#timeline-container").html("");
	}
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		if(acct.type=="notf"){
			var notf_attr=' data-notf='+acct.domain;
			var if_notf="hide";
		}else{
			var notf_attr='';
			var if_notf="";
		}
		if(localStorage.getItem("notification_" + acct.domain)){
			var unique_notf=lang.lang_layout_thisacct.replace("{{notf}}" ,localStorage.getItem("notification_" + acct.domain));
		}else{
			if(lang.language=="ja"){
				var notflocale="通知";
			}else if(lang.language=="en"){
				var notflocale="Notification";
			} 
			var unique_notf=lang.lang_layout_thisacct.replace("{{notf}}" ,notflocale);
		}
		var insert="";
		var icnsert="";
		if(acct.background){
			if(acct.text=="def"){
				
			}else{
			if(acct.text=="black"){
				var txhex="000000";
				var ichex="9e9e9e"
			}else if(acct.text=="white"){
				var txhex="ffffff";
				var ichex="eeeeee"
			}
			insert='background-color:#'+acct.background+'; color: #'+txhex+'; ';
			icnsert=' style="color: #'+ichex+'" ';
			}
		}
		console.log(acct.domain);
		if(acctlist[acct.domain]){
			if(acctlist[acct.domain].background!="def"){
				insert=insert+" border-bottom:medium solid #"+acctlist[acct.domain].background+";";
			}
		}
		if(acct.type=="notf" && localStorage.getItem("setasread")=="no"){
			localStorage.setItem("hasNotfC_" + acct.domain,"true");
		}else{
			localStorage.removeItem("hasNotfC_" + acct.domain);
		}
		if(acct.type=="webview"){
			if(localStorage.getItem("fixwidth")){
				var fixwidth=localStorage.getItem("fixwidth");
				var css=" min-width:"+fixwidth+"px;"
			}else{
				var css="";
			}
			var html =webview("https://tweetdeck.twitter.com",key,insert,icnsert,css);
			$("#timeline-container").append(html);
		}else{
			var width = localStorage.getItem("width");
		if (width) {
			var css=" min-width:"+width+"px;"
		}
		var anime = localStorage.getItem("animation");
		if (anime=="yes" || !anime) {
			var animecss="box-anime";
		}else{
			var animecss="";
		}
		if(acct.type=="notf"){
			var exclude=lang.lang_excluded+':<br><input type="checkbox" class="filled-in" id="exc-reply-'+key+'" '+excludeCk(key,"mention")+' /><label for="exc-reply-'+key+'" class="exc-chb"><i class="fa fa-share exc-icons"></i></label> '+
			'<input type="checkbox" class="filled-in" id="exc-fav-'+key+'"  '+excludeCk(key,"favourite")+' /><label for="exc-fav-'+key+'" class="exc-chb"><i class="fa fa-star exc-icons"></i></label> '+
			'<input type="checkbox" class="filled-in" id="exc-bt-'+key+'" '+excludeCk(key,"reblog")+' /><label for="exc-bt-'+key+'" class="exc-chb" ><i class="fa fa-retweet exc-icons"></i></label> '+
			'<input type="checkbox" class="filled-in" id="exc-follow-'+key+'" '+excludeCk(key,"follow")+' /><label for="exc-follow-'+key+'" class="exc-chb" ><i class="fa fa-users exc-icons"></i></label> '+
			'<button class="btn waves-effect" style="width:60px; padding:0;" onclick="exclude('+key+')">Filter</button><br>';
		}else if(acct.type=="home"){
			var exclude='<a onclick="ebtToggle(' + key +
			')" class="setting nex"><i class="fa fa-retweet waves-effect nex" title="'+lang.lang_layout_excludingbt +'" style="font-size:24px"></i><span id="sta-bt-' +
			key + '">Off</span></a>'+lang.lang_layout_excludingbt+'<br>';
		}else{
			var exclude="";
		}
		var html = '<div style="'+css+'" class="box '+animecss+'" id="timeline_box_' + key + '_box" tlid="' + key +
			'" data-acct="'+acct.domain+'"><div class="notice-box z-depth-2" id="menu_'+key+'" style="'+insert+' ">'+
			'<div class="area-notice"><i class="material-icons waves-effect red-text" id="notice_icon_' + key + '"'+notf_attr+' style="font-size:40px; padding-top:25%;" onclick="goTop(' + key + ')" title="'+lang.lang_layout_gotop +'"></i></div>'+
			'<div class="area-notice_name"><span id="notice_' + key + '" class="tl-title"></span></div>'+
			'<div class="area-a1"><a onclick="notfToggle(' + acct.domain + ',' + key +
						  ')" class="setting nex '+if_notf+'" title="'+unique_notf+'"'+icnsert+'><i class="material-icons waves-effect nex notf-icon_' +
						  acct.domain + '">notifications</i></div><div class="area-sta"><span class="new badge teal notf-reply_'+acct.domain+' hide" data-badge-caption="Reply">0</span><span class="new badge yellow black-text notf-fav_'+acct.domain+' hide" data-badge-caption="Fav">0</span><span class="new badge blue notf-bt_'+acct.domain+' hide" data-badge-caption="BT">0</span><span class="new badge orange notf-follow_'+acct.domain+' hide" data-badge-caption="Follow">0</span></a></div>'+
			'<div class="area-a2"><a onclick="removeColumn(' + key +
						  ')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_layout_delthis +'"'+icnsert+'>cancel</i></a></div>'+
		  '<div class="area-a3"><a onclick="setToggle(' + key +
		  ')" class="setting nex" title="'+lang.lang_layout_setthis +'"'+icnsert+'><i class="material-icons waves-effect nex">settings</i></a></div></div>'+
		  '<div class="column-hide notf-indv-box z-depth-4" id="notf-box_' + key +
		  '"><div id="notifications_' + key +
		  '" data-notf="' + acct.domain + '" data-type="notf"></div></div><div class="column-hide notf-indv-box" id="util-box_' + key +
		  '" style="padding:5px;">'+exclude+'<a onclick="mediaToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_layout_mediafil +'">perm_media</i><span id="sta-media-' +
		  key + '">On</span></a>'+lang.lang_layout_mediafil +'<br><a onclick="cardToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_layout_linkanades +'">link</i><span id="sta-card-' +
		  key + '">On</span></a>'+lang.lang_layout_linkana +'<br><a onclick="voiceToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_layout_tts +'">hearing</i><span id="sta-voice-' +
		  key + '">On</span></a>'+lang.lang_layout_tts +'TL<br><a onclick="reconnector(' + key +
		  ',\''+acct.type+'\',\''+acct.domain+'\',\''+acct.data+'\')" class="setting nex '+if_notf+'"><i class="material-icons waves-effect nex '+if_notf+'" title="'+lang.lang_layout_reconnect+'">low_priority</i></a><span class="'+if_notf+'">'+lang.lang_layout_reconnect+'</span><br>'+lang.lang_layout_headercolor +'<br><div id="picker_'+key+'" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '"><div id="timeline_' + key +
			'" class="tl '+acct.type+'-timeline " tlid="' + key + '" data-type="' + acct.type + '" data-acct="'+acct.domain+'"><div id="landing_'+key+'" style="text-align:center">'+lang.lang_layout_nodata +'</div></div></div></div>';
		$("#timeline-container").append(html);
		localStorage.removeItem("pool_" + key);
		if (acct.data) {
			var data = acct.data;
		} else {
			var data = "";
		}
		if(localStorage.getItem("catch_" + key)){
			var delc="true";
		}else{
			var delc="false";
		}

		if(localStorage.getItem("voice_" + key)){
			var voice=true;
		}else{
			var voice=false;
		}
		tl(acct.type, data, acct.domain, key, delc,voice,"");
		cardCheck(key);
		ebtCheck(key);
		mediaCheck(key);
		catchCheck(key);
		voiceCheck(key);
		}
	});
	var box = localStorage.getItem("box");
	if (box == "absolute") {
		setTimeout(show, 1000);
	}
	if(localStorage.getItem("reverse")){
		$("#bottom").removeClass("reverse");
		$(".leftside").removeClass("reverse");
	}
	if(localStorage.getItem("sec") && localStorage.getItem("sec")!="nothing"){
		secvis(localStorage.getItem("sec"));
	}
	favTag();
	var cw = localStorage.getItem("always-cw");
	if (cw == "yes") {
		if(!$("#cw").hasClass("cw-avail")){
			$("#cw-text").show();
			$("#cw").addClass("yellow-text");
			$("#cw").addClass("cw-avail");
			var cwt=localStorage.getItem("cw-text");
			if(cwt){
				$("#cw-text").val(cwt);
			}
		}
	}
}
//セカンダリートゥートボタン
function secvis(set){
	if(set=="public"){
		$("#toot-sec-icon").text("public");
		$("#toot-sec-btn").addClass("purple");
	}else if(set=="unlisted"){
		$("#toot-sec-icon").text("lock_open");
		$("#toot-sec-btn").addClass("blue");
	}else if(set=="private"){
		$("#toot-sec-icon").text("lock");
		$("#toot-sec-btn").addClass("orange");
	}else if(set=="direct"){
		$("#toot-sec-icon").text("mail");
		$("#toot-sec-btn").addClass("red");
	}else if(set=="limited"){
		$("#toot-sec-icon").text("group");
		$("#toot-sec-btn").addClass("teal");
	}else if(set=="local"){
		$("#toot-sec-icon").text("visibility");
		$("#toot-sec-btn").addClass("light-blue");
	}
	$("#toot-sec-btn").removeClass("hide");
}
//カラム追加
function addColumn() {
	var acct = $("#add-acct-sel").val();
	localStorage.setItem("last-use", acct);
	var type = $("#type-sel").val();
	if(acct=="noauth"){
		acct=$("#noauth-url").val();
		type="noauth"
	}else if(acct=="webview"){
		acct="";
		type="webview"
	}
	var add = {
		domain: acct,
		type: type
	};
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	if(!obj){
		var leng=0;
		var json = JSON.stringify([add]);
		localStorage.setItem("column", json);
	}else{
		var leng=obj.length;
		obj.push(add);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	}
	
	parseColumn();
}
function addselCk(){
	var acct = $("#add-acct-sel").val();
	var domain=localStorage.getItem("domain_" + acct);
	if(acct=="webview"){
		$("#auth").addClass("hide");
		$("#noauth").addClass("hide");
		$("#webview-add").removeClass("hide");
	}else if(acct=="noauth"){
		$("#auth").addClass("hide");
		$("#noauth").removeClass("hide");
		$("#webview-add").addClass("hide");
	}else{
		$("#auth").removeClass("hide");
		$("#noauth").addClass("hide");
		$("#webview-add").addClass("hide");
	}
	if(domain=="knzk.me" || domain=="mstdn.y-zu.org"){
		$("#type-sel").append('<option value="dm" data-trans="dm" id="direct-add">'+lang.layout_dm +'</option>');
		$('#type-sel').material_select('update');
	}else{
		$("#direct-add").remove();
		$('#type-sel').material_select('update');
	}
}
//カラム削除
function removeColumn(tlid) {
	$("#sort-box").addClass("hide");
	$("#sort-box").removeClass("show");
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	//聞く
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('column-del', "");
	ipc.on('column-del-reply', function (event, arg) {
		console.log(arg);
		if(arg==1){
			localStorage.removeItem("card_" + tlid);
			obj.splice(tlid, 1);
			for(var i=0;i<obj.length;i++){
				localStorage.setItem("card_" + i,"true");
				localStorage.removeItem("catch_" + i);
			}
			var json = JSON.stringify(obj);
			localStorage.setItem("column", json);
			parseColumn();
			sortload()
		}
	})
}

//設定トグル
function setToggle(tlid) {
	colorpicker(tlid);
	if($("#util-box_" + tlid).hasClass("column-hide")){
		$("#util-box_" + tlid).css("display","block")
		$("#util-box_" + tlid).animate({
			'height': '200px'
		},{
			'duration': 300,
			'complete': function(){
				$("#util-box_" + tlid).css("overflow-y","scroll")
				$("#util-box_" + tlid).removeClass("column-hide")
			}
		});
	}else{
		$("#util-box_" + tlid).css("overflow-y","hidden")
		$("#util-box_" + tlid).animate({
			'height': '0'
		},{
			'duration': 300,
			'complete': function(){
				$("#util-box_" + tlid).addClass("column-hide")
				$("#util-box_" + tlid).css("display","none")
			}
		});
	}
}
function colorpicker(key){
	temp=
		'<div onclick="coloradd('+key+',\'def\',\'def\')" class="pointer">Default</div>'+
		'<div onclick="coloradd('+key+',\'f44336\',\'white\')" class="red white-text pointer">Red</div>'+
		'<div onclick="coloradd('+key+',\'e91e63\',\'white\')" class="pink white-text pointer">Pink</div>'+
		'<div onclick="coloradd('+key+',\'9c27b0\',\'white\')" class="purple white-text pointer">Purple</div>'+
		'<div onclick="coloradd('+key+',\'673ab7\',\'white\')" class="deep-purple white-text pointer">Deep-purple</div>'+
		'<div onclick="coloradd('+key+',\'3f51b5\',\'white\')" class="indigo white-text pointer">Indigo</div>'+
		'<div onclick="coloradd('+key+',\'2196f3\',\'white\')" class="blue white-text pointer">Blue</div>'+
		'<div onclick="coloradd('+key+',\'03a9f4\',\'black\')" class="light-blue black-text pointer">Light-blue</div>'+
		'<div onclick="coloradd('+key+',\'00bcd4\',\'black\')" class="cyan black-text pointer">Cyan</div>'+
		'<div onclick="coloradd('+key+',\'009688\',\'white\')" class="teal white-text pointer">Teal</div>'+
		'<div onclick="coloradd('+key+',\'4caf50\',\'black\')" class="green black-text pointer">Green</div>'+
		'<div onclick="coloradd('+key+',\'8bc34a\',\'black\')" class="light-green black-text pointer">Light-green</div>'+
		'<div onclick="coloradd('+key+',\'cddc39\',\'black\')" class="lime black-text pointer">Lime</div>'+
		'<div onclick="coloradd('+key+',\'ffeb3b\',\'black\')" class="yellow black-text pointer">Yellow</div>'+
		'<div onclick="coloradd('+key+',\'ffc107\',\'black\')" class="amber black-text pointer">Amber</div>'+
		'<div onclick="coloradd('+key+',\'ff9800\',\'black\')" class="orange black-text pointer">Orange</div>'+
		'<div onclick="coloradd('+key+',\'ff5722\',\'white\')" class="deep-orange white-text pointer">Deep-orange</div>'+
		'<div onclick="coloradd('+key+',\'795548\',\'white\')" class="brown white-text pointer">Brown</div>'+
		'<div onclick="coloradd('+key+',\'9e9e9e\',\'white\')" class="grey white-text pointer">Grey</div>'+
		'<div onclick="coloradd('+key+',\'607d8b\',\'white\')" class="blue-grey white-text pointer">Blue-grey</div>'+
		'<div onclick="coloradd('+key+',\'000000\',\'white\')" class="black white-text pointer">Black</div>'+
		'<div onclick="coloradd('+key+',\'ffffff\',\'black\')" class="white black-text pointer">White</div>';
	$("#picker_"+key).html(temp);
}
function coloradd(key,bg,txt){
	var col = localStorage.getItem("column");
	var o = JSON.parse(col);
	var obj=o[key];
	obj.background=bg;
	obj.text=txt;
	o[key]=obj;
	var json = JSON.stringify(o);
	localStorage.setItem("column", json);
	if(txt=="def"){
		$("#menu_"+key).css("background-color","");
		$("#menu_"+key).css("color","");
	}else{
	$("#menu_"+key).css('background-color','#'+bg);
	if(txt=="black"){
		var bghex="000000";
		var ichex="9e9e9e"
	}else if(txt=="white"){
		var bghex="ffffff";
		var ichex="eeeeee"
	}
	$("#menu_"+key+" .nex").css('color','#'+ichex);
	$("#menu_"+key).css('color','#'+bghex);
	}
}
//禁断のTwitter
function webview(url,key,insert,icnsert,css){
	var html = '<div class="box" id="timeline_box_' + key + '_box" tlid="' + key +
			'" style="'+css+'"><div class="notice-box z-depth-2" id="menu_'+key+'" style="'+insert+'">'+
			'<div class="area-notice"><i class="fa fa-twitter waves-effect" id="notice_icon_' + key + '" style="font-size:40px; padding-top:25%;"></i></div>'+
			'<div class="area-notice_name tl-title">WebView('+url+')</div>'+
			'<div class="area-sta"><input type="checkbox" id="webviewsel" value="true" class="filled-in"><label for="webviewsel">'+lang.lang_layout_webviewmode +'</label></div>'+
			'<div class="area-a2"><a onclick="removeColumn(' + key +
						  ')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_layout_delthis +'"'+icnsert+'>cancel</i></a></div>'+
		  '<div class="area-a3"><a onclick="setToggle(' + key +
		  ')" class="setting nex" title="'+lang.lang_layout_setthis +'"'+icnsert+'><i class="material-icons waves-effect nex">settings</i></a></div></div>'+
		  '<div class="column-hide notf-indv-box z-depth-4" id="notf-box_' + key +
		  '"></div><div class="column-hide notf-indv-box" id="util-box_' + key +
		  '" style="padding:5px;">'+lang.lang_layout_headercolor +'<br><div id="picker_'+key+'" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '" style="width:100%;height:calc(100% - 110px);"><div id="timeline_' + key +
			'" class="tl" tlid="' + key + '" data-type="webview" style="width:100%;height:100%;"><webview src="'+url+'" style="width:100%;height:100%;" id="webview" preload="./js/platform/twitter.js"></webview></div></div></div>';
	
	return html;
}