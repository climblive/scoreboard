var api = function() {

	var get = function(url, onSuccess) {
		var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            		onSuccess(JSON.parse(xmlhttp.responseText));
                xmlhttp = null;
            } else {
            		console.error("ERROR", xmlhttp);
            }
        };
        xmlhttp.send();
	}
	
	
	var getContender = function(code, onSuccess) {
		console.log("Hej!");
		get("https://clmb.live/api/contender/" + code, onSuccess)
	};
	
	return {
		getContender: getContender
	}; 
}();