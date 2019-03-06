//アンケートのトグル
function pollToggle() {
	if ($("#poll").hasClass("hide")) {
        $("#right-side").show()
		$("#poll").removeClass("hide")
	} else {
        $("#right-side").hide()
        $("#emoji").addClass("hide")
		$("#poll").addClass("hide")
	}
}
function pollProviderCk(){
    $(".poll-provider").addClass("hide");
    $("#"+$("#poll-sel").val()).removeClass("hide");
}
/*
function pollAddtime(num){
    var last=$("#expires_in").val();
    last=last*1-(num*-1);
    $("#expires_in").val(last);
    pollCalc();
}
*/
function pollCalc(){
    var days=$("#days_poll").val();
    var hrs=$("#hours_poll").val();
    var mins=$("#mins_poll").val();
    console.log(days*86400+hrs*3600+mins*60)
    return days*86400+hrs*3600+mins*60;

}
//Vote
function voteSelMastodon(acct_id,id,to,mul){
    console.log('.vote_'+acct_id+'_'+id+'_'+to);
    if($('.vote_'+acct_id+'_'+id+'_'+to).hasClass("sel")){
        $('.vote_'+acct_id+'_'+id+'_'+to).css("background-color","transparent")
        $('.vote_'+acct_id+'_'+id+'_'+to).removeClass("sel");
    }else{
        if(!mul){
            $('.vote_'+acct_id+'_'+id+' div' ).each(function(i, elem) {
                if(i==to){
                    $(this).css("background-color","var(--emphasized)");
                    $(this).addClass("sel");
                }else{
                    $(this).css("background-color","transparent")
                    $(this).removeClass("sel");
                }
            });
        }else{
            $('.vote_'+acct_id+'_'+id+'_'+to).css("background-color","var(--emphasized)")
            $('.vote_'+acct_id+'_'+id+'_'+to).addClass("sel");
        }
    }
    
}
function voteMastodon(acct_id,id){
    var choice=[];
    $('.vote_'+acct_id+'_'+id+' div' ).each(function(i, elem) {
        if($(this).hasClass("sel")){
            choice.push(i+"");
        }
    });
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/v1/polls/"+id+"/votes";
    if(localStorage.getItem("mode_" + domain)=="misskey"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
    httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
    httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({choices:choice}));
    httpreq.onreadystatechange = function() {
		voteMastodonrefresh(acct_id,id)
	}
}
function showResult(acct_id,id){
    $('.vote_'+acct_id+'_'+id+'_result').toggleClass("hide")
}
function voteMastodonrefresh(acct_id,id){
    var datetype = localStorage.getItem("datetype");
    if (!datetype) {
		datetype = "absolute";
	}
    var httpreqd = new XMLHttpRequest();
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/v1/polls/"+id;
	httpreqd.open('GET', start, true);
	httpreqd.setRequestHeader('Content-Type', 'application/json');
    httpreqd.responseType = 'json';
	httpreqd.send(JSON.stringify({i:at,noteId:id}));
    httpreqd.onreadystatechange = function() {
		if (httpreqd.readyState == 4) {
            var json = httpreqd.response;
            console.log(json);
            if(!json){
                return false;
            }
            var poll="";
		    var choices=json.options;
			var myvote=lang.lang_parse_voted;
			var result_hide="";
			Object.keys(choices).forEach(function(keyc) {
				var choice = choices[keyc];
				if(!json.voted){
					votesel='voteSelMastodon(\''+acct_id+'\',\''+json.id+'\','+keyc+','+json.multiple+')';
				}
				poll=poll+'<div class="pointer vote vote_'+acct_id+'_'+json.id+'_'+keyc+'" onclick="'+votesel+'">'+choice.title+'<span class="vote_'+acct_id+'_'+json.id+'_result '+result_hide+'">('+choice.votes_count+')</span></div>';
			});
			poll=poll+myvote+'<span class="cbadge cbadge-hover" title="' + date(json.expires_at, 'absolute') +
			'"><i class="fa fa-calendar-times-o"></i>' +
            date(json.expires_at, datetype) + '</span>';
            $('.vote_'+acct_id+'_'+json.id).html(poll)
		}
	}
}