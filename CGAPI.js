var CGAPI = {};
CGAPI.settings = {
	// host: "http://kor10.esy.es/"
	host: "http://carigawe/"
};

CGAPI.ajax = function (method, url,terima=function(){}, body=null, headers={}){
	var request;
	if(window.XMLHttpRequest){
		request=new XMLHttpRequest();
	}else{
		request=new ActiveXObject("Microsoft.XMLHTTP");
	}
			
	request.open( method ,url);
	for(var i in headers){
		request.setRequestHeader(i,headers[i]);
	}
	request.send(body);
	request.onreadystatechange=function(){
		if(request.readyState==4){
			terima(request);
		}
	}

}

CGAPI.callFunction = function(name, param,terima=function(){}){
	var def_terima = function(r){
		try{
			var data = JSON.parse(r.responseText);
			return terima(data.data, data.error);
		}catch(e){
			console.log(e);
			return terima(null,{code:"4003",name:"kesalahan tidak diketahui"} );
		}
	}
	return this.ajax("POST", this.settings.host+name, def_terima, 
		Object.keys(param).map(a=>a+"="+encodeURIComponent(param[a])).join("&"),
		{
			'Content-Type':'application/x-www-form-urlencoded'
		} 
	);
}

