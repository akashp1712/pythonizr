$(function(){

    /**************
     DATA LOADING
    **************/

    var urlPreProcessing = "resources/data/pre-processing.json";
    var urlModels = "resources/data/models.json";

    var dataPreProcessing, dataModels;
    $.when(
        $.getJSON(urlPreProcessing, function(data) {
            dataPreProcessing = data;
        }),
        $.getJSON(urlModels, function(data) {
            dataModels = data;
        })
    ).then(function() {
        if (dataPreProcessing && dataModels) {
            loadMain(); // load main script
            $('#all-content').addClass('loaded'); // Make the main content visible
        }
    });

    function loadMain() {
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
            $("#models").find("h3").html("Model (Regression)");

            $('#classification-models').hide();
        });

        $('#preconfig-classification').click(function(){
            fillDefaultModules('classification');
            $('#regression-models').hide();
            $("#models").find("h3").html("Model (Classification)");

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

            /*Add components from each module*/
            pipelineData["pre-processing"] = [dataPreProcessing["name"]];
            $("#pre-processing").find("input:checked").each(function() {
                var value = $(this).val();
                if (value != "none") {
                    importList.push(dataPreProcessing["data"][value]["imports"]); // Add imports
                    codeList.push(dataPreProcessing["data"][value]["code"]); // Add code
                    pipelineData["pre-processing"].push(dataPreProcessing["data"][value]["name"]); // Add pipeline component
                }
            });

            pipelineData["models"] = [dataModels["name"]];
            $("#models").find("input:checked").each(function() {
                var value = $(this).val();
                importList.push(dataModels["data"][value]["imports"]); // Add imports
                codeList.push(dataModels["data"][value]["code"]); // Add code
                pipelineData["models"].push(dataModels["data"][value]["name"]); // Add pipeline component
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

            // Display the list of code lines
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

        function updatePipeline() {

            var x = document.getElementsByClassName("container__sources");
            x[0].innerHTML = '';

            var keys = Object.keys(pipelineData);
            var animatedLine = getAnimatedLine();
            var needLine = false;

            for (var i = 0, pipeKey; pipeKey = keys[i++];){

                // Create div for each block
                var dataPipe=document.createElement('div');
                dataPipe.className = "step";
                dataPipe.innerHTML = '';

                pipeData = pipelineData[pipeKey];

                if (pipeData.length > 1) { // Pipe has some function (1 is header)

                    // Add header
                    var header = document.createElement('h3');
                    header.innerHTML = pipeData[0];
                    dataPipe.appendChild(header);

                    // Add each added element
                    for (var j = 1, value; value = pipeData[j++];) {
                        var p = document.createElement('p');
                        p.innerHTML = value;
                        dataPipe.appendChild(p);
                    }

                    if (needLine == true) {
                       // Append the animated line before every pipe except first
                        x[0].appendChild(animatedLine);
                    }

                    x[0].appendChild(dataPipe);
                    needLine = true;
                }
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

    }
});
