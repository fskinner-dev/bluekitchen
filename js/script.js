// $(function () {
//     // Same as document.addEventListener("DOMContentLoaded"...
//   });
  
  (function (global) {
    var mc = {};     // mc prefix for menu called functions
    var cbNavData = {};   // local cache of data from cb-nav.json
    
    var bkAsideHtml = "views/bk-aside.html";
    var bkNavHtml = "views/bk-nav.html";
    var cbAsideHtml = "views/cb-aside.html";
    var cbNavHtml = "views/cb-nav.html";
    var cbNavJsonPath = "data/cb-nav.json";
    var dflAsideHtml = "views/dfl-aside.html";
    var dflNavHtml = "views/dfl-nav.html";
    var p3AsideHtml = "views/p3-aside.html";
    var p3NavHtml = "views/p3-nav.html";
    
    //-------------------//
    // UTILITY FUNCTIONS //
    //-------------------//
    
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
    var switchMenuToActive = function (id) {
      var classes = document.querySelector("#home").className;
      classes = classes.replace(new RegExp("current", "g"), "");
      document.querySelector("#home").className = classes;
  
      // Add 'active' to menu button if not already there
      classes = document.querySelector(id).className;
      if (classes.indexOf("current") == -1) {
        classes += " current";
        document.querySelector("#home").className = classes;
      }
    };

    //------------------------//
    // EVENT DRIVEN FUNCTIONS //
    //------------------------//

    // On page load
    document.addEventListener("DOMContentLoaded", function (event) {
      showLoading("#nav-content");
      $ajaxUtils.sendGetRequest(
        bkNavHtml,
        function (responseText) {
          document.querySelector("#nav-content").innerHTML = responseText;
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
    });

    mc.toggleClass = function(id) {
      var element = document.getElementById(id);
      // this adds or removes the class on this element
      element.classList.toggle("active");

      // likewise this adds or removes this class on this element 
      // element.parentElement.classList.toggle("caret-down");
      element.parentElement.querySelector(".caret").classList.toggle("caret-down");
      element.parentElement.querySelector(".title").classList.toggle("title-underline");     
    }

    mc.addTitlePhoto = function(id) {
      console.log('addTitlePhoto called');
      var element = document.getElementById(id);
      insertHtml("#article-content", "<img src='images/menu/A.jpg'></img>");
    }

    mc.addRecipePhoto = function(id) {
      var element = document.getElementById(id);
      var photo = "";
      photo = id+'.png';
      console.log("photo is " + photo);
      insertHtml("#article-content", "<img src=images/menu/"+ photo +"></img>");
    }

    mc.clearNav = function() {
      insertHtml("#nav-content", "");
    }

    mc.clearAside = function() {
      insertHtml("#aside-content", "");
    }

    mc.clearArticle = function() {
      insertHtml("#article-content", "");
    }

    // COOKBOOK NAV
    mc.loadCbNav = function () {
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";
      
      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/bk-medium-white-logo.JPG")',
        'background-repeat:no-repeat;');
      
      document.getElementById(headerH1).innerHTML = "Blue Kitchen Cookbook";
      document.getElementById(headerH4).innerHTML = "a compilation of our family's favorites";
      showLoading("#aside-content");
      $ajaxUtils.sendGetRequest(
        cbNavHtml,
        function(cbNavHtml){
          // Switch CSS class active to menu button
          switchMenuToActive("#cb");
          insertHtml("#aside-content", cbNavHtml);
        },
        false
      );

      mc.clearAside();
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

    mc.loadDfl = function() {
      // showLoading("#nav-content");
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";
      var liCookbook = "li-cookbook";
      var home = "home";

      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/dfl/dfl-logo-medium.jpg")',
  'background-repeat:no-repeat;');

      document.getElementById(headerH1).innerHTML = "Drum For Life";
      document.getElementById(headerH4).innerHTML = "a project of Blue Kitchen, Inc.";
      document.getElementById(liCookbook).innerHTML = "";
      document.getElementById(home).innerHTML = "back to the kitchen";

      $ajaxUtils.sendGetRequest(
        dflNavHtml,
        function(dflNavHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive("#dfl");
          insertHtml("#nav-content", dflNavHtml);
        },
        false
      );
      $ajaxUtils.sendGetRequest(
        dflAsideHtml,
        function(dflAsideHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive();
          insertHtml("#aside-content", dflAsideHtml);
        },
        false
      );
    };

    mc.loadP3 = function() {
      // header
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";
      var liCookbook = "li-cookbook";
      var home = "home";

      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/p3/pigeonpea-medium.png")',
  'background-repeat:no-repeat;');

      document.getElementById(headerH1).innerHTML = "Pigeon Pea Project";
      document.getElementById(headerH4).innerHTML = "a project of Blue Kitchen, Inc.";
      document.getElementById(liCookbook).innerHTML = "";
      document.getElementById(home).innerHTML = "back to the kitchen";

      // nav
      $ajaxUtils.sendGetRequest(
        p3NavHtml,
        function(p3NavHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive("#p3");
          insertHtml("#nav-content", p3NavHtml);
        },
        false
      );

      // content
      $ajaxUtils.sendGetRequest(
        p3AsideHtml,
        function(p3AsideHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive();
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
  
  //   // 'categoryShort' is a short_name for a category
  //   mc.loadRecipeList = function (categoryShort) {
  //     showLoading("#main-content");
  //   // extract the recipe titles in this category (categoryShort)
  //   // new list to contain recipe titles in this category
  //   var recipeTitles = [];
  //   var categoryTitle = null;
  //   var shortName = null;

  //   // loop through data looking for category short name.
  //   for (i = 0; i < data.length; i++){
  //     if (data[i].short_name == categoryShort) {
  //       shortName = data[i].short_name;
  //       categoryTitle = data[i].name;
  //       // extract the recipe titles from this category into the new list
  //       for (j = 0; j < data[i].recipes.length; j++){
  //           recipeTitles[j] = data[i].recipes[j].recipe;
  //       }
  //       // break;
  //     }
  //   }  
  //   buildAndShowRecipeListHTML(shortName, categoryTitle, recipeTitles)
  // };

  // mc.loadRecipe = function(recipe) {  // passing in the recipe we need but recipes json isn't loaded yet
  //   showLoading("#main-content");
  //   selectedRecipe = recipe;
  //   $ajaxUtils.sendGetRequest(allRecipesUrl, buildAndShowRecipeHtml);
  // };

  // mc.loadTocImage = function(tocShortName){
  //   var html = tocShortName+"<img src='images/spices25.jpg'></div>";
  //     insertHtml('#display-image', html);
  // };

  // mc.hideTocImage = function(tocShortName){

  //   var html = "";
  //     insertHtml('#display-image', html); 
  // };    

  //---------------------------//
  // HTML GENERATION FUNCTIONS // 
  //---------------------------//

  // Build HTML for cookbook nav
    // function buildAndShowCookbookNavHTML(cbNavData) {
    //   // console.log(cbNavData);

    //   $ajaxUtils.sendGetRequest(
    //     cbNavHtml,
    //     function(cbNavHtml){
    //       // Switch CSS class active to menu button
    //       switchMenuToActive();
    //       var cbNavViewHtml = buildCookbookNavViewHtml(
    //         cbNavData,
    //         cbNavHtml
    //       );
    //       insertHtml("#main-content", cbNavHtml);
    //     },
    //     false
    //   );
    // }
  
    // function buildCookbookNavViewHtml(cbNavData, cbNavHtml) {
    //   var finalHtml = cbNavHtml;
    //   finalHtml += "<section>";

    //   var htmlString = "";
  
    //   // Loop over cbNavdata
    //   for (var i = 0; i < cbNavData.length; i++) {
    //     var buildPage = cbNavHtml;
    //     buildPage = insertProperty(buildPage, "name", cbNavData[i].name);
    //     var recipes = cbNavData[i].recipes;
    //     var addRecipe = buildPage;
    //     for (var j = 0; j < recipes.length; j++) {

    //       addRecipe = insertProperty(addRecipe, "recipe", recipes[j].recipe);
    //       htmlString += addRecipe;
    //       // Add clearfix after every second recipe item
    //       // if (i % 2 != 0) {
    //       //   htmlString3 +=
    //       //     "<div class='clearfix visible-lg-block visible-md-block'></div>";
    //       // }
    //     }
    //   }
    //   finalHtml += htmlName + htmlString + "</section>";
    //   return finalHtml;
    // }
  
    // Builds HTML for the single category page based on the data
    // from the server
    // function buildAndShowRecipeListHTML(shortName, categoryTitle, recipeTitles) {
    //   // Load recipe list title page
    //   $ajaxUtils.sendGetRequest(
    //     recipeListTitleHtml,
    //     function (recipeListTitleHtml) {
    //       // Retrieve single menu item snippet
    //       $ajaxUtils.sendGetRequest(
    //         recipeListHtml,
    //         function (recipeListHtml) {
    //           // Switch CSS class active to menu button
    //           switchMenuToActive();
  
    //           var recipeListViewHtml = buildRecipeListViewHtml(shortName, categoryTitle, recipeTitles, recipeListTitleHtml, recipeListHtml);
    //           insertHtml("#main-content", recipeListViewHtml);
    //         },
    //         false
    //       );
    //     },
    //     false
    //   );
    // }

    // function buildAndShowRecipeHtml(recipes){
    //     recipeData = recipes; 
    //     $ajaxUtils.sendGetRequest(
    //       recipeTitleHtml,
    //       function (recipeTitleHtml) {
    //         // Retrieve single recipe snippet
    //            $ajaxUtils.sendGetRequest(
    //              recipeDetailHtml,
    //              function (recipeDetailHtml) {
    //                // Switch CSS class active to menu button
    //                switchMenuToActive();       
    //                var recipeViewHtml = buildRecipeViewHtml(selectedRecipe, recipeData, recipeTitleHtml, recipeDetailHtml);
    //                insertHtml("#main-content", recipeViewHtml);
    //              },
    //              false
    //            );
    //          },
    //          false
    //        );     
    //   } 

    // function buildRecipeListViewHtml(shortName, categoryTitle, recipeTitles, recipeListTitleHtml, recipeListHtml) {
    //   recipeListTitleHtml = insertProperty(
    //     recipeListTitleHtml,
    //     "name",
    //     categoryTitle
    //   );
  
    //   var finalHtml = recipeListTitleHtml;
    //   finalHtml += "<section class='row'>";
  
    //   // Loop over recipe list
    //  for (var i = 0; i < recipeTitles.length; i++) {
    //     // Insert recipe list values
    //     var html = recipeListHtml;
    //     html = insertProperty(html, "recipe", recipeTitles[i]);

    //     // Add clearfix after every second recipe item
    //     if (i % 2 != 0) {
    //       html +=
    //         "<div class='clearfix visible-lg-block visible-md-block'></div>";
    //     }
  
    //     finalHtml += html;
    //   }
  
    //   finalHtml += "</section>";
    //   return finalHtml;
    // }

      // function buildRecipeViewHtml(selectedRecipe, recipeData, recipeTitleHtml, recipeDetailHtml) {
      //   recipeTitleHtml = insertProperty(
      //     recipeTitleHtml,
      //     "recipeTitle",
      //     selectedRecipe
      //   );
    
      //   var finalHtml = recipeTitleHtml;
      //   finalHtml += "<section class='row'>";
    
      //   // Loop over recipes and extract details for selected recipe
      //   for (var i = 0; i < recipeData.length; i++) {
      //     if (recipeData[i].name == selectedRecipe){
      //       var html = recipeDetailHtml;
      //       html = insertProperty(html, "recipeHaiku", recipeData[i].haiku);
      //       html = insertProperty(html, "recipeIngredients", recipeData[i].ingredients);
      //       html = insertProperty(html, "recipeDirections", recipeData[i].directions);
      //       finalHtml += html;
      //     }
      
      //     // Add clearfix after every second recipe item
      //     if (i % 2 != 0) {
      //       html +=
      //         "<div class='clearfix visible-lg-block visible-md-block'></div>";
      //     }
      //   }
    
      //   finalHtml += "</section>";
      //   return finalHtml;
      // }
  


// ------------------do not cross------------------ //
    global.$mc = mc;
  })(window);
  