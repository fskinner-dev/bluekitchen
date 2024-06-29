// $(function () {
//     // Same as document.addEventListener("DOMContentLoaded"...
//   });
  
  (function (global) {
    var mc = {};     // mc prefix for menu called functions
    var cbData = {};   // local cache of data from cb-data.json
    
    var bkAsideHtml = "views/bk-aside.html";
    var bkContentHtml = "views/bk-content.html";
    var projNavHtml = "views/proj-nav.html";
    var cbAsideHtml = "views/cb-aside.html";
    var cbNavHtml = "views/cb-nav.html";
    var cbNavJsonPath = "data/cb-nav.json";
    var dflAsideHtml = "views/dfl-aside.html";
    var dflMainHtml = "views/dfl-main.html";
    var p3AsideHtml = "views/p3-aside.html";
    var p3MainHtml = "views/p3-main.html";

    var prevId = "#home";
    
    //-------------------------
    // LOCAL UTILITY FUNCTIONS 
    //-------------------------
    
    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
  
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };
  
    // Return substitute of '{{propName}}' with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    };
  
    // Remove the class 'active' from home and switch to Menu button
    var switchMenuToActive = function (currId) {
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

    // On page load
    document.addEventListener("DOMContentLoaded", function (event) {
      showLoading("#bk-content");
      $ajaxUtils.sendGetRequest(
        bkContentHtml,
        function (responseText) {
          document.querySelector("#bk-content").innerHTML = responseText;
        },
        false
      );
      
      $ajaxUtils.sendGetRequest(
        bkAsideHtml,
        function (responseText) {
          document.querySelector("#aside-content").innerHTML = responseText;
        },
        false
      );  
      
      /* fetch the cookbook data and store it in global cbData */
      fetch('data/cb-data.json')
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
        function(projNavHtml){
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
    mc.loadCbNav = function () {
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";
      
      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/bk/bk-medium-white-logo.JPG")',
        'background-repeat:no-repeat;');
      
      document.getElementById(headerH1).innerHTML = "Blue Kitchen Cookbook";
      document.getElementById(headerH4).innerHTML = "a compilation of our family's favorite recipes";
      showLoading("#cb-content");
      $ajaxUtils.sendGetRequest(
        cbNavHtml,
        function(cbNavHtml){
          switchMenuToActive("#cb");
          // might be able to do both of these in clearContent
          clearContent("#main-content")
          clearContent("#aside-content");
          clearContent("#bk-content");
          insertHtml("#cb-content", cbNavHtml);
        },
        false
      );

      // footer
      var bkEmail = "footer-email";
      var bkFb = "footer-fb";
      var bkYt = "footer-yt";
      var bkInsta = "footer-insta";
      var email = document.getElementById(bkEmail);
      email.setAttribute('href', "mailto:bluekitchenmuse@icloud.com");
      var fb = document.getElementById(bkFb);
      fb.setAttribute('href', "https://www.facebook.com/bluekitchen");
    };

    loadRecipePhoto = function(id) {
      var element = document.getElementById(id);
      var photo = "";
      photo = id+'.png';
      insertHtml("#recipe-photo", "<img src=images/cb/"+ photo +"></img>");
    }

    loadRecipeTitle = function(id) {
      // id is of the form <category_code><recipes index> ex. A3
      var category_code = id.charAt(0);
      var recipes_index = id.charAt(1);
      var catIndex = 0;

      for (var i = 0; i < cbData.length; i++){
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
    mc.loadDfl = function() {

      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";

      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/dfl/dfl-logo-medium.jpg")',
  'background-repeat:no-repeat;');

      document.getElementById(headerH1).innerHTML = "Drum For Life";
      document.getElementById(headerH4).innerHTML = "a project of Blue Kitchen, Inc.";

      $ajaxUtils.sendGetRequest(
        dflMainHtml,
        function(dflMainHtml){
          insertHtml("#main-content", dflMainHtml);
        },
        false
      );
      $ajaxUtils.sendGetRequest(
        dflAsideHtml,
        function(dflAsideHtml){
          insertHtml("#aside-content", dflAsideHtml);
        },
        false
      );
    };

    mc.loadP3 = function() {
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";

      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/p3/pigeonpea-medium.png")',
  'background-repeat:no-repeat;');

      document.getElementById(headerH1).innerHTML = "Pigeon Pea Project";
      document.getElementById(headerH4).innerHTML = "a project of Blue Kitchen, Inc.";

      $ajaxUtils.sendGetRequest(
        p3MainHtml,
        function(p3MainHtml){
          insertHtml("#main-content", p3MainHtml);
        },
        false
      );

      $ajaxUtils.sendGetRequest(
        p3AsideHtml,
        function(p3AsideHtml){
          insertHtml("#aside-content", p3AsideHtml);
        },
        false
      );

      // footer
      var p3Email = "footer-email";
      var p3Fb = "footer-fb";
      var p3Yt = "footer-yt";
      var p3Insta = "footer-insta";
      var email = document.getElementById(p3Email);
      email.setAttribute('href', "mailto:pigeonpeaproject@outlook.com");
      var fb = document.getElementById(p3Fb);
      fb.setAttribute('href', "https://www.facebook.com/people/Pigeon-Pea-Project/61559276664883/?mibextid=LQQJ4d");
      // document.getElementById(p3Yt).innerHTML = 
      // document.getElementById(p3Insta).innerHTML = 
    };


// ------------------do not cross------------------ //
    global.$mc = mc;
  })(window);
  