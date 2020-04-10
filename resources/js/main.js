$(function(){

	/************
	    CONFIG
	 ************/
	var config = {
		defaultModules:{
			regression: [
                'dataLoading',
                'trainTestSplit',
                'linearReg'
            ],
			classification: [
                'dataLoading',
                'trainTestSplit',
                'svm'
            ]
		},
	};

	/************
	   VARIABLES
	 ************/

    // TODO: Display loading screen till these variables get loaded
	var dataPreProcessing;
	$.getJSON( "resources/data/pre-processing.json", function(data) {
        dataPreProcessing = data;
    });

    var dataModels;
	$.getJSON( "resources/data/models.json", function(data) {
        dataModels = data;
    });

	var codeList = [];
	var pipelineData = {};

	/**********
	   EVENTS
	 **********/

	$('input').click(function(){
		update();
	});

	$('#preconfig-regression').click(function(){
		fillDefaultModules('regression');
		$('#regression-models').show();
		$('#classification-models').hide();
	});

	$('#preconfig-classification').click(function(){
		fillDefaultModules('classification');
		$('#regression-models').hide();
		$('#classification-models').show();
	});

	/*********
	   LOGIC
	 *********/

	function fillDefaultModules(type){
		$('input').attr('checked', false);

		for (var i = 0, curModule; curModule = config.defaultModules[type][i++];){
			$('input[value=' + curModule +']').attr('checked', true);
		};
		update();
		$('#hidden-section').fadeIn('slow');
	}

	function update(){
		updateModules();
		updateCode();
		updatePipeline();
	}

	function updateModules(){
	    importList = [];
		codeList = [];
		pipelineData = {};

        pipelineData["pre-processing"] = [dataPreProcessing["name"]];
		$("#pre-processing").find("input:checked").each(function() {
		    var value = $(this).val();
		    if (value != "none") {
		        importList.push(dataPreProcessing["data"][value]["imports"]);
                codeList.push(dataPreProcessing["data"][value]["code"]);
                pipelineData["pre-processing"].push(dataPreProcessing["data"][value]["name"]);
            }
        });

        pipelineData["models"] = [dataModels["name"]];
        $("#models").find("input:checked").each(function() {
            var value = $(this).val();
            importList.push(dataModels["data"][value]["imports"]);
            codeList.push(dataModels["data"][value]["code"]);
            pipelineData["models"].push(dataModels["data"][value]["name"]);
        });

        $("#post-processing").find("input:checked").each(function() {
            // TODO: do same as above
        });
	}

	function updateCode() {

        var codeFull = [];

        // Include all the imports
        for (var i = 0, code; code = importList[i++];){
		    codeFull = codeFull.concat(code);
		}

        // Include all the code
		for (var i = 0, code; code = codeList[i++];){
		    codeFull = codeFull.concat([""]);
		    codeFull = codeFull.concat(code);
		}

        displayData(codeFull);

        function displayData(codeLines) {
            // Display the data
            var codeElem = "";

            codeLines.forEach(function(value) {
                codeElem = codeElem + value + "<br>";
            });

            $("#code").html(codeElem);
            $('pre code').each(function(i, e) {hljs.highlightBlock(e);}); // highlight the code
        }
    }

    // TODO: Optimize the function
    function updatePipeline() {

        var x = document.getElementsByClassName("container__sources");
        x[0].innerHTML = '';

        var keys = Object.keys(pipelineData);
        var animatedLine = getAnimatedLine();

        for (var i = 0, pipeKey; pipeKey = keys[i++];){
		    if (i != 1) {
                x[0].appendChild(animatedLine);
            }

            var dataPipe=document.createElement('div');
            dataPipe.className = "step";
            dataPipe.innerHTML = '';

            pipeData = pipelineData[pipeKey];

            var header = document.createElement('h3');
            header.innerHTML = pipeData[0];
            dataPipe.appendChild(header);

            for (var j = 1, value; value = pipeData[j++];) {
                var p = document.createElement('p');
                p.innerHTML = value;
                dataPipe.appendChild(p);
            }

            x[0].appendChild(dataPipe);
        }


        function getAnimatedLine() {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('viewBox', "0 0 100 80");

            var line = document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('x1', "5");
            line.setAttribute('x2', "100");
            line.setAttribute('y1', "70");
            line.setAttribute('y2', "70");

            svg.appendChild(line);
            return svg;
        }
    }

	/***********
	   HELPERS
	 ***********/
	
	if (!Array.indexOf){
		Array.prototype.indexOf = function(searchedElement){
			for (var i = 0; i < this.length; i++){
				if (this[i] === searchedElement)
					return i;
			};
			return -1;
		};
	}
	
	Array.prototype.remove = function(searchedElement){
		var i = this.indexOf(searchedElement);
		if (i != -1)
			this.splice(i, 1);
	};
	
	/***********
	    MAIN
	 ***********/

	if ($('input:checked').length > 0)
		$('#hidden-section').fadeIn(0);

	update();

});
