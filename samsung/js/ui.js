var ui = function() {

	var showCode = function(onFinished) {
		var codeInput = document.getElementById("codeInput");
		codeInput.style.display="block";
		codeInput.addEventListener("keyup", function(event) {
			if(event.keyCode === 13 || event.keyCode === 10) {
				onFinished(codeInput.value);				
			}
		});
	};
	
	var hideCode = function() {
		var codeInput = document.getElementById("codeInput");		
		codeInput.style.display="none";
	}

	var showProblems = function(problems) {
		console.log("show problems", problems);
		var problemsList = document.getElementById("problemsList");
		problemsList.style.display="block";
		var template = problemsList.querySelector("#template");
		problems.forEach(function(problem) {
			var copy = template.cloneNode(true);
			copy.style.background=problem.color;
			copy.style.color=problem.textColor;
			copy.innerHtml=problem.colorName;
			problemsList.appendChild(copy);
		});
	};
	
	return {
		showCode: showCode,
		hideCode: hideCode,
		showProblems: showProblems
	}; 
}();