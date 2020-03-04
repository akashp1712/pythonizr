$(function(){

	/************
	    CONFIG
	 ************/
	var config = {

		defaultModules:{
			custom: [
			        'no_license',
			        'main_py'
			        ],
			classic: [
                     'setup_py',
                     'readme_rst',
                     'requirements_txt',
                     'no_license',
                     'manifest_in',
                     'gitignore'
                     ],
            web: [
                    'flask_single_module',
                    'requirements_txt'
                 ]
		},
		baseUrl:'https://pythonizr.com:80/builder?'
	};
	
	/************
	   VARIABLES
	 ************/
	
	var params;
	var modules = [];
	var stylelang = '';

	// vars to hold files(string) and folders (dictionary of a single key:value(list) pair)
	var setup_list = ['setup.py', {'sample': ['__init__.py','main.py']}, {'test': ['test_basic.py']}];
	var config_list = [{'config': ['__init__.py','cfg.ini', 'cfg_handler.py']}];
	var flask_single_list = ['app.py', 'config.py'];

	var preModules = {
            'main_py': 'main.py', 'setup_py': setup_list, 'readme_rst': 'README.rst',
            'requirements_txt': 'requirements.txt', 'manifest_in': 'MANIFEST.in',
            'gitignore': '.gitignore', 'config_handler': config_list,
            'argparse': 'argparse_helper.py',
            'mit_license': 'LICENSE.txt', 'apache_license': 'LICENSE.txt',
            'gnu_license': 'LICENSE.txt', 'empty_license': 'LICENSE.txt',
            'flask_single_module': flask_single_list
        }

	/**********
	   EVENTS
	 **********/	

	$('input').click(function(){
		update();
	});

	
	$('#preconfig-custom').click(function(){
		fillDefaultModules('custom');
	});

	$('#preconfig-classic').click(function(){
		fillDefaultModules('classic');
	});

	$('#preconfig-web').click(function(){
		fillDefaultModules('web');
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
		updateUrls();
		updateTree();
	}
	
	function updateModules(){
		modules = [];
		$('input').each(function(){
			if ($(this).is(':checked'))
				modules.push($(this).val());
		});
	}

	function updateUrls(){
		var modeParam = '';
		
		if (stylelang != ''){
			modeParam = 'mode=' + stylelang + '&';
		}

		params = '';
		
		for (var i = 0, curModule; curModule = modules[i++];){
			params += curModule + '&';
		}
		
		params = params.substring(0, params.length - 1);

		$('#preview-url').val(config.baseUrl + 'print&' + modeParam + params);
		$('#download-url').val(config.baseUrl + modeParam + params);	
		
		$('#preview-link').attr('href', config.baseUrl + 'print&' + modeParam + params);
		$('#download-link').attr('href', config.baseUrl + modeParam + params);	
	}

	function updateTree(){

        var treeChildList = [];
        var treeChildList = getListOfRequiredFiles();

        var parentUL=document.createElement('ul');
        parentUL.className = "tree";
        generateChildTree(parentUL, [{'pythonizr.zip': treeChildList}])

        var x = document.getElementsByClassName("tree-block");
        x[0].innerHTML = '';
        x[0].appendChild(parentUL);

	}

    /**************************
        HELPERS FOR TREE-VIEW
    **************************/

    // Get the list of files//dirs required to print in TreeView
    function getListOfRequiredFiles() {

        var fileList = [];
        for (var i=0, curModule; curModule=modules[i++];) {
            fileName = preModules[curModule];
            if (typeof fileName === 'string') {
                // variable is string
                fileList.push(fileName);
            } else if (!(typeof fileName === 'undefined')) {
                // variable is list
                for (var k = 0, file; file = fileName[k++];) {
                    fileList.push(file);
                }
            }
        }
        return fileList;
    }

    // Recursive function to generate DOM for files and folders from the list
    function generateChildTree(ulTemp, setupModules) {

        // eliminate the undefined types
        if (!(typeof setupModules === 'undefined')) {

            for (var j= 0, listValue; listValue = setupModules[j++];) {

               child = listValue;
               if (typeof child === 'string') {
                  // child is string, append on same level
                    var liSetupFile=document.createElement('li');
                    liSetupFile.innerHTML=child;
                    ulTemp.appendChild(liSetupFile);

               } else {
               // child is list of dictionaries, create new folder for each with key as folder name and value of list as files

                   for (var key in child) {
                       var liFolder = document.createElement('li');
                       liFolder.innerHTML = key; // root folder

                       var ulInside = document.createElement('ul');
                       ulInside.className = 'tree';

                       // recursive call for list in the directory
                       generateChildTree(ulInside, child[key]);

                       liFolder.appendChild(ulInside);
                       ulTemp.appendChild(liFolder);
                    }
                }
            }
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
