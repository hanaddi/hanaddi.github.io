var PFXD_name = "PFXD";
window[PFXD_name] = {
	ajax : function (method, url, body=null, headers={},terima=function(){}){
		body = body || null;
		headers = headers || null;
		terima = terima || function(){};
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
		};

	},
	init : function(callback=e=>e,id){
		this.id = id || this.id;
		this.ajax("POST", "https://"+this.id+".playfabapi.com/Client/LoginWithCustomID",
			JSON.stringify({
				"CustomId": "1",
				"CreateAccount": true,
				"TitleId": this.id
			}),
			{
				"Content-Type": "application/json"
			},
			function(r){
				try{
					r = JSON.parse(r.responseText);
					if(r.code != 200)throw "Return code not OK";
					window[PFXD_name].session = r.data.SessionTicket;
					callback();
				}catch(e){
					window[PFXD_name].session = null;
					throw e;
				}
			}
		);
	},
	call : function(args,callback=e=>e){
		if(this.session==null) return this.init(()=>this.call(args,callback));
		args = args || this.args;

		this.ajax("POST", "https://"+this.id+".playfabapi.com/Client/ExecuteCloudScript",
			JSON.stringify({
				"RevisionSelection":"Live",
				"FunctionName":"makeHTTPRequest",
				"FunctionParameter":args
			}),
			{
				"Content-Type": "application/json",
				"X-Authentication" : this.session
			},
			function(r){
				try{
					r = JSON.parse(r.responseText);
					if(r.code != 200)throw "Return code not OK";
					callback(r.data.FunctionResult.responseContent);
				}catch(e){
					throw e;
				}
			}
		);
	},

	session : null,
	args : {
		url:'http://g.hol.es',
		httpMethod:'GET',
		contentType:'text/html',
		headers:{
			"User-Agent": "PFXD API caller/0.1"
		},
		content:''
	},
	id : '8dfa'

};