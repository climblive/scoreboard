var storage = function() {

	var getCode = function() {
		return window.localStorage.getItem("code");
	};

	var setCode = function(code) {
		return window.localStorage.setItem("code", code);
	};
	
	return {
		getCode: getCode,
		setCode: setCode
	}; 
}();