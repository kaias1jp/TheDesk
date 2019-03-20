/*リプライ*/
function re(id,ats_cm,acct_id,mode){
	clear();
	var ats=ats_cm.split(',');
	localStorage.setItem("nohide",true);
	show();
	$("#reply").val(id);
	for(var i=0;i<ats.length;i++){
		var at=ats[i];
		var te=$("#textarea").val();
		$("#textarea").val("@"+at+" "+te);
	}
	$("#rec").text(lang.lang_yesno);
	$("#post-acct-sel").val(acct_id);
	$("#post-acct-sel").prop("disabled", true);
	$('select').material_select();
	$("#textarea").attr("placeholder",lang.lang_usetxtbox_reply);
	$("#textarea").focus();
	var profimg=localStorage.getItem("prof_"+acct_id);
	if(!profimg){
		profimg="../../img/missing.svg";
	}
	$("#acct-sel-prof").attr("src",profimg);
	vis(mode);
}
function reEx(id){
	$('#tootmodal').modal('close');
	var at=$("#tootmodal").attr("data-user");
	var acct_id = $("#status-acct-sel").val();
	var mode=$("#tootmodal .vis-data").attr("data-vis");
	re(id,at,acct_id,mode);
}
//引用
function qt(id,acct_id,at,url){
	localStorage.setItem("nohide",true);
	var qt = localStorage.getItem("quote");
	if(!qt){
		var qt="simple";
	}
	if(qt=="nothing"){
		return false;
	}
	if(qt=="simple"){
		show();
		$("#textarea").val("\n"+url);
	}else if(qt=="mention"){
		show();
		$("#textarea").val("\n"+url+" From:@"+at);
	}else if(qt=="full"){
		show();
		var html=$("[toot-id="+id+"] .toot").html();
		html = html.match(/^<p>(.+)<\/p>$/)[1];
		html = html.replace(/<br\s?\/?>/, "\n");
		html = html.replace(/<p>/, "\n");
		html = html.replace(/<\/p>/, "\n");
		html=$.strip_tags(html);
		$("#textarea").val("\n"+"@"+at+" "+html+"\n"+url);
	}
	$("#textarea").focus();
	$("#post-acct-sel").val(acct_id);
	$('select').material_select();
}