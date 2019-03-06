var ui = function(tau) {

    var page,
    list,
    listHelper;

    var onShowProblemsButtonClick = function() {
    		showProblems(data.getProblems());
    }
    
    var initEvents = function() {
		document.getElementById("showProblemsButton").addEventListener("click", onShowProblemsButtonClick);
    		
    }
    
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
	
	var onProblemClick = function(evt) {
		console.log("onProblemClick ", evt);
		tau.openPopup("#problemPopup");

	   /* Popup closes with Cancel button click */
	   document.getElementById('1btnPopup-sent').addEventListener('click', function(ev) {
	      tau.closePopup();
	   });
	};

	var showMain = function() {
		tau.changePage("main");
	}
	
	var showProblems = function(problems) {
		console.log("show problems", problems);
		var problemsList = document.getElementById("problemsList");
		var template = document.getElementById("template");
		console.log("template: ", template);
		problems.forEach(function(problem) {
			var copy = template.cloneNode(true);
			copy.id = "problem_" + problem.id;
			copy.style.background=problem.color;
			copy.style.color=problem.textColor;
			copy.querySelector('.name').innerHTML=problem.id;
			copy.querySelector('.color').innerHTML=problem.colorName;
			copy.querySelector('.points').innerHTML=problem.points;
			copy.addEventListener("click", onProblemClick);
			problemsList.appendChild(copy);
		});
		tau.changePage("problems");
        //listHelper = tau.helper.SnapListStyle.create(problemsList);
	};
	
	return {
		initEvents: initEvents,
		showCode: showCode,
		hideCode: hideCode,
		showProblems: showProblems,
		showMain: showMain
	}; 
}(tau);