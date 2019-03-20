//入力時にハッシュタグと@をサジェスト
var timer = null;

var input = document.getElementById("textarea");

var prev_val = input.value;
var oldSuggest;
var suggest;

input.addEventListener("focus", function() {
	var acct_id = $("#post-acct-sel").val();
	$("#suggest").html("");
	window.clearInterval(timer);
	timer = window.setInterval(function() {
		var new_val = input.value;
		if(new_val==""){
			$("#suggest").html("");
			if($("#poll").hasClass("hide") && $("#emoji").hasClass("hide")){
				$("#right-side").hide()
			}
			return;
		}
		if (prev_val != new_val) {
			var semoji = new_val.match(/:(\S{3,})/);
			if(semoji){
				var obj = JSON.parse(localStorage.getItem("emoji_" + acct_id));
				if(!obj){
					var ehtml=lang.lang_suggest_nodata;
				}else{
					var num = obj.length;
					var ehtml="";
					for (i = 0; i < num; i++) {
						var emoji = obj[i];
						if ( ~emoji.shortcode.indexOf(semoji[1])) {
							if (emoji) {
							ehtml =  ehtml+'<a onclick="emojiInsert(\':' + emoji.shortcode +
								': \',\':'+semoji[1]+'\')" class="pointer"><img src="' + emoji.url + '" width="20"></a>';
							}
						}
						}
				}
				if(ehtml!=""){
					$("#right-side").show()
					$("#poll").addClass("hide")
					$("#emoji").addClass("hide")
				}else{
					if($("#poll").hasClass("hide") && $("#emoji").hasClass("hide")){
						$("#right-side").hide()
					}
				}
				$("#suggest").html(ehtml);
			}
			
			var tag = new_val.match(/#(\S{3,})/);
			var acct = new_val.match(/@(\S{3,})/);
			if(localStorage.getItem("imas")){
				//セルフNP
				var cpnp = new_val.match(/^(?!.*http)\/\/(\S{1,})/);
			}else{
				var cpnp=[];
			}
			if (cpnp && cpnp[1]) {
				var q = cpnp[1];
				cgNPs(q);
			} else if (tag && tag[1]) {
				var q = tag[1];
			} else if (acct && acct[1]) {
				var q = acct[1];
			}else  {
				$("#suggest").html("");
				if($("#poll").hasClass("hide") && $("#emoji").hasClass("hide")){
					$("#right-side").hide()
				}
				return;
			}
			var domain = localStorage.getItem("domain_" + acct_id);
			var at = localStorage.getItem("acct_"+ acct_id + "_at");
			suggest = "https://" + domain + "/api/v1/search?q=" + q
			if (suggest != oldSuggest) {
				console.log(suggest)
				fetch(suggest, {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						'Authorization': 'Bearer ' + at
					},
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					if (json.hashtags[0] && tag) {
						if(tag[1]){
						var tags = "";
						Object.keys(json.hashtags).forEach(function(key4) {
							var tag = json.hashtags[key4];
							if(tag!=q){
								tags = tags + '<a onclick="tagInsert(\'#' + tag + '\',\'#' + q +
								'\')" class="pointer">#' + tag + '</a><br>';
							}
						});
						$("#right-side").show()
						$("#suggest").html("Tags:<br>" + tags);
						$("#poll").addClass("hide")
						$("#emoji").addClass("hide")
						}
					} else if (json.accounts[0] && acct[1]) {
						var accts = "";
						Object.keys(json.accounts).forEach(function(key3) {
							var acct = json.accounts[key3];
							if(acct.acct!=q){
								accts = accts + '<a onclick="tagInsert(\'@' + acct.acct +
								'\',\'@' + q + '\')" class="pointer">@' + acct.acct + '</a><br>';
							}
						});
						$("#right-side").show()
						$("#suggest").html("@:<br>" + accts);
						$("#poll").addClass("hide")
						$("#emoji").addClass("hide")
					} else {
						if($("#poll").hasClass("hide") && $("#emoji").hasClass("hide")){
							$("#right-side").hide()
						}
					}
				});
			}
		};
		oldSuggest = suggest;
		prev_value = new_val;
	}, 1000);
}, false);

input.addEventListener("blur", function() {
	window.clearInterval(timer);
	favTag();
}, false);
function tagInsert(code, del) {
	var now = $("#textarea").val();
	var selin = $("#textarea").prop('selectionStart');
	if (!del) {
	} else {
		var regExp = new RegExp(del, "g");
		var now = now.replace(regExp, "");
		selin=selin-del.length;
	}
	if(selin>0){
		var before   = now.substr(0, selin);
		var after    = now.substr(selin, now.length);
		newt = before + " "+ code+" " + after;
	}else{
		newt = code+" "+now;
	}
	$("#textarea").val(newt);
	$("#textarea").focus();
	if($("#poll").hasClass("hide") && $("#emoji").hasClass("hide")){
		$("#right-side").hide()
	}
	$("#suggest").html("");
}
function cgNPs(q){
	suggest = "https://cg.toot.app/api/v1/search/light?q=" + q
			if (suggest != oldSuggest) {
				console.log(suggest)
				fetch(suggest, {
					method: 'GET',
					headers: {
						'content-type': 'application/json'
					},
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					console.log(json);
					if (json[0]) {
						var tags = "";
						Object.keys(json).forEach(function(key4) {
							var tag = json[key4];
							tags = tags + '<a onclick="cgNP(\''+json[key4]+'\')" class="pointer">' + json[key4] + '</a>  ';
						});
						$("#suggest").html("Cinderella NowPlaying:" + tags);
					}else{
						$("#suggest").html("Cinderella NowPlaying:Not Found");
					}
				});
			}
}