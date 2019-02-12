//ドラッグ・アンド・ドロップからアップロードまで。uiのimg.jsとは異なります。
var obj = $("body");
var system;
//ドラッグスタート
obj.on('dragstart', function(e) {
	system = "locked"
});
//何もなくファイルが通過
obj.on('dragend', function(e) {
	system = "";
});
//ドラッグファイルが画面上に
obj.on('dragenter', function(e) {
	if (system != "locked") {
		$("#drag").css('display', 'flex');
	}

});
$("body").on('dragover', function(e) {
	e.stopPropagation();
	e.preventDefault();
});
//ドロップした
$("body").on('drop', function(e) {
	if (system != "locked") {
		$("#drag").css('display', 'none');
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		pimg(files);
	}
});
//何もなくファイルが通過
$("#drag").on('dragleave', function(e) {
	$("#drag").css('display', 'none');
});

//複数アップ
function pimg(files) {
	console.log(files);
	for (i = 0; i < files.length; i++) {
		var dot=files[i].path.match(/\.(.+)$/)[1];
		if(dot=="bmp" || dot=="BMP"){
			var electron = require("electron");
		  	var ipc = electron.ipcRenderer;
			  ipc.send('bmp-image', [files[i].path,i]);
			  todo(lang.lang_progress);
			  
		}else{
			handleFileUpload(files[i], obj,i);
		}
	}
}
var electron = require("electron");
var ipc = electron.ipcRenderer;
ipc.on('bmp-img-comp', function (event, b64) {
	media(b64[0],"image/png",b64[1]);
  });
//ドラッグ・アンド・ドロップを終了
function closedrop() {
	$("#drag").css('display', 'none');
}
//ファイル選択
function fileselect() {
	ipc.send('file-select', "");
}
function readImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
image.onerror = (e) => reject(e);
image.src = file;
});
}


function readFile(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (event) => resolve(event.target.result);
fr.onerror = (e) => reject(e);
        fr.readAsDataURL(file);
});
}


function getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);
            
    function fail(e) {
          alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
    }
}

function convertImgToBase64()
{
    var canvas = document.createElement('CANVAS');
    img = document.createElement('img'),
    img.src = "/tmp/temp.jpg";
    img.onload = function()
    {
        canvas.height = img.height;
        canvas.width = img.width;
        b64 = canvas.toDataURL('image/png');
        canvas = null; 
    };
}




//ファイル読み込み
function handleFileUpload(files, obj, no) {
console.log("file upload");
//alert("1upload:"+files["name"]+files["type"]);
//	var fr = new FileReader();
//	fr.onload = function(evt) {

/*readFile(files).then(evt=> {




var b64 = evt.result;

//alert("2start resize");

});*/
var w = 0; 
var h = 0;
var b64 = "";
readImage(files.path).then(image=> {

result = {width: image.naturalWidth, height: image.naturalHeight};

//alert("3image:width:"+result.width);
if (result.width*result.height>1024*1024) {

if (result.width>result.height) {
w = 1280;
h = result.height*(1280.0/result.width);
} else {
h = 1280;
w = result.width*(1280.0/result.height);
}
}
//alert("4w:"+w+" h:"+h);

//alert("in jimp"+w+" "+h);
var Jimp = require("jimp");
 Jimp.read(files["path"])
    .then(image=>{
     image
       .resize(w,h)
         .getBase64(Jimp.MIME_JPEG, function (err, src) {
                $('#b64-box').val(src);
                var ret = media(src, files["type"], no, true);
       


});
}).catch(function (err) {
    alert(err);
});










}).catch(e=> {
alert(e);
});



/*var image = new Image();
image.src =fr.result;
image.onload = function() {

result = {width: image.naturalWidth, height: image.naturalHeight};

//alert("image:width:"+result.width);
if (result.width*result.height>1024*1024) {

if (result.width>result.height) {
w = 1280;
h = result.height*(1280.0/result.width);
} else {
h = 1280;
w = result.width*(1280.0/result.height);
}


//alert("w:"+w+" h:"+h);
}
}*/
readFile(files).then(result=> {
//alert("readFile");
if (w*h>0) {
//alert("img64");
/*   ImgB64Resize(result, w, h).then(img_b64=>{
            // Destination Image
//alert("re media()");
       b64 = img_b64;
}).catch(e=>{
alert(e);



});*/
var b64 = "";
/*alert("in jimp"+w+" "+h);
var Jimp = require("jimp");
 Jimp.read(files["path"])
    .then(image=>{
     image
       .resize(w,h)
.getBase64(Jimp.MIME_PNG, function (err, src) {
            mainWindow.webContents.send('bmp-img-comp', [src,0]);
     });
       .getBase64Async(Jimp.AUTO).then(base64=>{
//alert("getbase64");              
b64= base64;
         });
}).catch(function (err) {
    alert(err);
});*/
/*       .getBase64ASync(Jimp.MIME_JPEG)
       .then(base64Image => b64 = base64Image)
//       .catch(err => ...)
})*/
//.catch(err => ...)
/*readFile("/tmp/temp.jpg").then(result=> {
b64 = result;
//alert("out jimp");
}).catch(e=>{
alert(e);


});*/
/*getFileContentAsBase64("/tmp/temp.jpg",function(b64){
  //window.open(base64Image);
  console.log(b64); 
  // Then you'll be able to handle the myimage.png file as base64
});*/

//alert("out jimp:");
//alert("media call2");
                $('#b64-box').val(b64);
                var ret = media(b64, files["type"], no, true)

//alert("end");

}else{ 


b64 = result;
//}
//alert("media call");
		$('#b64-box').val(b64);
		var ret = media(b64, files["type"], no, false)
	}
//	fr.readAsDataURL(files);
}).catch(e=> {
alert(e);


});


	$("#mec").append(files["name"] + "/");
}

//ファイルアップロード
function media(b64, type, no, isblob) {
//alert("media start");
var l = 4;
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
  		r += c[Math.floor(Math.random()*cl)];
	}
	if ($("#media").val()) {
		$("#media").val($("#media").val() + ',' + "tmp_"+r);
	} else {
		$("#media").val("tmp_"+r);
	}
	$(".toot-btn-group").prop("disabled", true);
	$("#post-acct-sel").prop("disabled", true);
//alert("toblob");
	localStorage.setItem("image","busy");
	todo("Image Upload...");
if (isblob != true){
	var media = toBlob(b64, type);
}else{
//alert(b64);
var media = toBlob(b64,type);
}
//	alert(media.size);
	var fd = new FormData();
	fd.append('file', media);
	var acct_id = $("#post-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
//alert(acct_id);
	var httpreq = new XMLHttpRequest();
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/drive/files/create";
		httpreq.open('POST', start, true);
		httpreq.upload.addEventListener("progress", progshow, false);
		httpreq.responseType = 'json';
		if ($("#nsfw").hasClass("nsfw-avail")) {
			var nsfw = true;
		} else {
			var nsfw = false;
		}
		var previewer="url"
		fd.append('i', at);
		//fd.append('isSensitive', nsfw);
		httpreq.send(fd);
	}else{
		var previewer="preview_url"
		var start = "https://" + domain + "/api/v1/media";
		httpreq.open('POST', start, true);
		httpreq.upload.addEventListener("progress", progshow, false);
		httpreq.responseType = 'json';
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		httpreq.send(fd);
//alert("start:"+start);
	}
//    httpreq.onreadystatechange = function() {
//alert(JSON.parse(httpreq.response));
//alert("state:"+httpreq.readyState);
httpreq.onload = function() {
//alert(httpreq.status);
/*if (httpreq.status == 422) {
//alert("media resize check w:"+w+" h:"+h);
    ImgB64Resize(b64, w, h, 
        function(img_b64) {
            // Destination Image
//alert("re media()");
       var media = toBlob(img_b64, type);
        //alert(media.size);
        var fd = new FormData();
        fd.append('file', media);
        var acct_id = $("#post-acct-sel").val();
        var domain = localStorage.getItem("domain_" + acct_id);
        var at = localStorage.getItem("acct_"+ acct_id + "_at");
//alert(acct_id);
        var httpreq = new XMLHttpRequest();
        if(localStorage.getItem("mode_" + domain)=="misskey"){
                var start = "https://" + domain + "/api/drive/files/create";
                httpreq.open('POST', start, true);
                httpreq.upload.addEventListener("progress", progshow, false);
                httpreq.responseType = 'json';
                if ($("#nsfw").hasClass("nsfw-avail")) {
                        var nsfw = true;
                } else {
                        var nsfw = false;
                }
                var previewer="url"
                fd.append('i', at);
                //fd.append('isSensitive', nsfw);
                httpreq.send(fd);
        }else{
                var previewer="preview_url"
                var start = "https://" + domain + "/api/v1/media";
                httpreq.open('POST', start, true);
                httpreq.upload.addEventListener("progress", progshow, false);
                httpreq.responseType = 'json';
                httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
                httpreq.send(fd);
}
httpreq.onload = function() {
//alert(httpreq.status);
//alert(httpreq.statusText);
                if (httpreq.readyState == 4) {
//alert("state:4");
                        var json = httpreq.response;
                        var img = localStorage.getItem("img");
//alert(json.id);
//alert(json.type);
//alert(json.url);
                        if (json.type.indexOf("image")!=-1) {
                                var html = '<img src="' + json[previewer] + '" style="width:50px; max-height:100px;">';
                                $('#preview').append(html);
                        } else {
                                $('#preview').append(lang.lang_postimg_previewdis);
                        }
                        if (!img) {
                                var img = "no-act";
                        }
                        if (img != "inline") {
                                var mediav=$("#media").val();
                                var regExp = new RegExp("tmp_"+r, "g");
                                mediav = mediav.replace(regExp, json["id"]);
                                $("#media").val(mediav);

                        }
                        if (img == "url") {
                                $("#textarea").val($("#textarea").val() + " " + json["text_url"])
                        }
                        todc();
                        $(".toot-btn-group").prop("disabled", false);
                        $('select').material_select();
                        $("#mec").text(lang.lang_there);
                        Materialize.toast(lang.lang_postimg_aftupload, 1000);
                        $("#imgup").text("");
                        $("#imgsel").show();
                        localStorage.removeItem("image");
                }
        }

        }

    );


}*/
//alert(httpreq.statusText);
		if (httpreq.readyState == 4) {
//alert("state:4");
			var json = httpreq.response;
			var img = localStorage.getItem("img");
//alert(json.id);
//alert(json.type);
//alert(json.url);
			if (json.type.indexOf("image")!=-1) {
				var html = '<img src="' + json[previewer] + '" style="width:50px; max-height:100px;">';
				$('#preview').append(html);
			} else {
				$('#preview').append(lang.lang_postimg_previewdis);
			}
			if (!img) {
				var img = "no-act";
			}
			if (img != "inline") {
				var mediav=$("#media").val();
				var regExp = new RegExp("tmp_"+r, "g");
				mediav = mediav.replace(regExp, json["id"]);
				$("#media").val(mediav);
				
			}
			if (img == "url") {
				$("#textarea").val($("#textarea").val() + " " + json["text_url"])
			}
			todc();
			$(".toot-btn-group").prop("disabled", false);
			$('select').material_select();
			$("#mec").text(lang.lang_there);
			Materialize.toast(lang.lang_postimg_aftupload, 1000);
			$("#imgup").text("");
			$("#imgsel").show();
			localStorage.removeItem("image");
		}
	}
}
function ImgB64Resize(imgB64_src, width, height) {
  return new Promise((resolve, reject) => {
   var img_type = imgB64_src.substring(5, imgB64_src.indexOf(";"));
    const img = new Image();
    img.onload = (imgB64_dst) => {
        // New Canvas
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        // Draw (Resize)
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Destination Image
        imgB64_dst = canvas.toDataURL(img_type);
}
    img.onerror = (e) => reject(e);
  img.src = imgB64_src;
});
}
/*    // Image Type
    var img_type = imgB64_src.substring(5, imgB64_src.indexOf(";"));
    // Source Image
    var img = new Image();
    img.onload = function() {
        // New Canvas
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        // Draw (Resize)
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Destination Image
        var imgB64_dst = canvas.toDataURL(img_type);
        callback(imgB64_dst);
    };
    img.src = imgB64_src;
}*/

//Base64からBlobへ
function toBlob(base64, type) {
var bin = atob(base64.replace(/^.*,/, ''));
var buffer = new ArrayBuffer(bin.length);
var dv = new DataView(buffer);
for (var i = 0; i < bin.length; i++) {
 dv.setUint8(i, bin.charCodeAt(i));
}
//alert(bin.length);
        try {
                var blob = new Blob([buffer], {
                        type: type
                });
        } catch (e) {
//alert("blob error");
                return false;
        }

        return blob;


}

function atoBlob(base64, type) {
	var bin = atob(base64.replace(/^.*,/, ''));
	var buffer = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i);
	}
	// Blobを作成
	try {
		var blob = new Blob([buffer], {
			type: type
		});
	} catch (e) {
//alert("blob error");
		return false;
	}

	return blob;
}

//画像を貼り付けたら…
var element =  document.querySelector("#textarea");
element.addEventListener("paste", function(e){
	console.log(e)
    // 画像の場合
    // e.clipboardData.types.length == 0
    // かつ
    // e.clipboardData.types[0] == "Files"
    // となっているので、それ以外を弾く
    if (!e.clipboardData 
            || !e.clipboardData.types
            || (e.clipboardData.types.length != 1)
            || (e.clipboardData.types[0] != "Files")) {
				console.log("not image")
            return true;
    }

    // ファイルとして得る
    // (なぜかgetAsStringでは上手くいかなかった)
    var imageFile = e.clipboardData.items[0].getAsFile();

    // FileReaderで読み込む
    var fr = new FileReader();
    fr.onload = function(e) {
        // onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
		var base64 = e.target.result;
		var mediav = $("#media").val();
		if(mediav){
			var i=mediav.split(",").length;
		}
		media(base64, "image/png", i)
    };
    fr.readAsDataURL(imageFile);

    // 画像以外がペーストされたときのために、元に戻しておく
});
//Adobeフォトエディタ
function adobe(){
	var agree = localStorage.getItem("adobeagree");
	ipc.send('adobe', agree);
}
ipc.on('adobeagree', function (event, arg) {
	localStorage.setItem("adobeagree",arg);
  });
