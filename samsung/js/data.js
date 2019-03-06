var data = function() {

	var problems;
	
	var setProblems = function(_problems) {
		problems = _problems;
	}
	
	var getProblems = function() {
		return problems;
	}
	
	return {
		setProblems: setProblems,
		getProblems: getProblems
	}; 
}();