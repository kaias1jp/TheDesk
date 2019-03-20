function menu(){
    if(!$("#menu").hasClass("appear")){
        $("#menu").addClass("appear")
        var left=localStorage.getItem("menu-left");
        if(left>$('body').width()-$('#menu').width()){
          left=$('body').width()-$('#menu').width();
        }else if(left<0){
            left=0;
        }
        var top=localStorage.getItem("menu-top");
        if(top>$('body').height()-$('#menu').height()){
            top=$('body').height()-$('#menu').height();
        }else if(top<0){
            top=0;
        }
        $('#menu').css("left",left+"px")
        $('#menu').css("top",top+"px")
        $('#menu').fadeIn();
        $("#menu-bar").html("TheDesk "+localStorage.getItem("ver"));
        $(".menu-content").addClass("hide");
        $("#add-box").removeClass("hide");
    }else{
        $('#menu').fadeOut()
        $("#menu").removeClass("appear")
    }
    
}
$(function() {
    $( "#menu" ).draggable({handle: "#menu-bar",
      stop: function() {
      var left=$('#menu').offset().left;
      if(left>$('body').width()-$('#menu').width()){
        left=$('body').width()-$('#menu').width();
      }else if(left<0){
          left=0;
      }
      var top=$('#menu').offset().top;
      if(top>$('body').height()-$('#menu').height()){
          top=$('body').height()-$('#menu').height();
      }else if(top<0){
          top=0;
      }
        localStorage.setItem("menu-left",left);
        localStorage.setItem("menu-top",top);
      }
    });
  });
function help(){
    const {shell} = require('electron');
	shell.openExternal("https://docs.thedesk.top");
}