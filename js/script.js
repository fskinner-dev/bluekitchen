// $(function () {
//     // Same as document.addEventListener("DOMContentLoaded"...
//   });

(function(global) {
	var mc = {}; // mc prefix for menu called functions
	var cbData = {}; // local cache of data from cb-data.json
	var projNavHtml = "views/proj-nav.html";
	var prevId = "#home";

	//-------------------------
	// LOCAL UTILITY FUNCTIONS 
	//-------------------------

	// Convenience function for inserting innerHTML for 'select'
	var insertHtml = function(selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	// Show loading icon inside element identified by 'selector'.
	// var showLoading = function (selector) {
	//   var html = "<div class='text-center'>";
	//   html += "<img src='images/ajax-loader.gif'></div>";
	//   insertHtml(selector, html);
	// };

	// Return substitute of '{{propName}}' with propValue in given 'string'
	var insertProperty = function(string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	};

	// Remove the class 'active' from home and switch to Menu button
	var switchMenuToActive = function(currId) {
		var classes = document.querySelector(prevId).className;
		classes = classes.replace(new RegExp("current", "g"), "");
		document.querySelector(prevId).className = classes;

		// Add 'active' to menu button if not already there
		classes = document.querySelector(currId).className;
		if (classes.indexOf("current") == -1) {
			classes += " current";
			document.querySelector(currId).className = classes;
			prevId = currId;
		}
	};

	// Tabbed Menu
	mc.openProjectMenu = function(evt, menuName) {
		var i, x;
		x = document.getElementsByClassName("menu");
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}

		document.getElementById(menuName).style.display = "block";
		evt.currentTarget.firstElementChild.className += " w3-white";

		switch (menuName) {
			case 'DRUM FOR LIFE':
				mc.loadDfl();
				break;
			case 'LEGACY COOKBOOK':
				mc.loadCbNav();
				break;
			case 'PIGEON PEA PROJECT':
				mc.loadP3();
				break;
			default:
				break;
		}
	}

	// Toggle between showing and hiding the sidebar when clicking the menu icon

	mc.w3_open = function() {
		document.getElementById("bkSidebar").style.display = "block";
	}

	// Close the sidebar with the close button
	mc.w3_close = function() {
		document.getElementById("bkSidebar").style.display = "none";
	}

	// On page load
	document.addEventListener("DOMContentLoaded", function(event) {

		/* fetch the cookbook data now and store it in global cbData <===== fix this so that we load data for cookbook only */
		fetch('../data/cb-data.json')
			.then(response => response.json())
			.then(data => {
				cbData = data;
				// console.log(cbData);       
			})
			.catch(error => console.error("Error fetching JSON data:", error));
	});

	clearContent = function(id) {
		insertHtml(id, "");
	}

	//------------------------------
	// EXTERNALLY INVOKED FUNCTIONS 
	//------------------------------
	mc.clearArticle = function() {
		insertHtml("#recipe-title", "");
		insertHtml("#recipe-photo", "");
		insertHtml("#recipe-description", "");
	}

	mc.toggleClass = function(id) {
		var element = document.getElementById(id);
		// this adds or removes the class on this element
		element.classList.toggle("active");
		element.parentElement.querySelector(".caret").classList.toggle("caret-down");
		element.parentElement.querySelector(".title").classList.toggle("title-underline");
	}

	// -----------------------
	// Load Projects Nav List
	// -----------------------
	mc.loadProjectNav = function() {

		$ajaxUtils.sendGetRequest(
			projNavHtml,
			function(projNavHtml) {
				switchMenuToActive("#projects");
				insertHtml("#main-content", projNavHtml);
			},
			false
		);
		clearContent("#cb-content");
		clearContent("#bk-content");
	};

	// ---------
	// COOKBOOK
	// ---------
	var cbAsideHtml = "views/cb-aside.html";
	var cbNavHtml = "views/cb-nav.html";

	mc.loadCbNav = function() {

		$ajaxUtils.sendGetRequest(
			cbNavHtml,
			function(cbNavHtml) {
				// switchMenuToActive("#cb");
				// might be able to do both of these in clearContent
				// clearContent("#main-content")
				// clearContent("#aside-content");
				// clearContent("#bk-content");
				insertHtml("#cb-content", cbNavHtml);
			},
			false
		);
	};

	loadRecipePhoto = function(id) {
		var element = document.getElementById(id);
		var photo = "";
		photo = id + '.png';
		insertHtml("#recipe-photo", "<img src=images/cb/" + photo + "></img>");
	}

	loadRecipeTitle = function(id) {
		// id is of the form <category_code><recipes index> ex. A3
		var category_code = id.charAt(0);
		var recipes_index = id.charAt(1);
		var catIndex = 0;

		for (var i = 0; i < cbData.length; i++) {
			if (cbData[i].category_code == category_code) {
				catIndex = i;
				break;
			}
		}

		var title = cbData[catIndex].recipes[recipes_index].title;
		document.querySelector("#recipe-title").innerHTML = title;
	}

	loadRecipeDescription = function(id) {
		document.querySelector("#recipe-description").innerHTML = "Recipe Description";
	}

	mc.loadRecipeOverview = function(id) {
		loadRecipePhoto(id);
		loadRecipeTitle(id);
		loadRecipeDescription(id);
	}

	// -------------
	// DRUM FOR LIFE
	// -------------
	var dflAsideHtml = "views/dfl-aside.html";
	var dflMainHtml = "views/dfl-main.html";

	mc.loadDfl = function() {

		$ajaxUtils.sendGetRequest(
			dflMainHtml,
			function(dflMainHtml) {
				insertHtml("#dfl-content", dflMainHtml);
			},
			false
		);
		$ajaxUtils.sendGetRequest(
			dflAsideHtml,
			function(dflAsideHtml) {
				insertHtml("#dfl-aside-content", dflAsideHtml);
			},
			false
		);
	};


	// ------------------
	// PIGEON PEA PROJECT
	// ------------------
	var p3AsideHtml = "views/p3-aside.html";
	var p3MainHtml = "views/p3-main.html";

	mc.loadP3 = function() {

		$ajaxUtils.sendGetRequest(
			p3MainHtml,
			function(p3MainHtml) {
				insertHtml("#p3-content", p3MainHtml);
			},
			false
		);

		$ajaxUtils.sendGetRequest(
			p3AsideHtml,
			function(p3AsideHtml) {
				insertHtml("#p3-aside-content", p3AsideHtml);
			},
			false
		);

	};

	mc.openDoc = function(menuId, menuName) {
		var i;
		var x = document.getElementsByClassName("p3-menu");
		var alreadyActive = false;

		if (document.getElementById(menuName).style.display === "block") {
			alreadyActive = true;
		}
		// clear menu and content
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
			if (document.getElementById(i).classList.contains("w3-grey")) {
				document.getElementById(i).classList.remove("w3-grey");
			}
		}
		if (!alreadyActive) {
			document.getElementById(menuName).style.display = "block";
			document.getElementById(menuId).classList.add("w3-grey");
			alreadyActive = false;
		}

	}

	// ------------------do not cross------------------ //
	global.$mc = mc;
})(window);