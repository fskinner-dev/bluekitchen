// $(function () {
//     // Same as document.addEventListener("DOMContentLoaded"...
//   });
  
  (function (global) {
    var mc = {};     // mc prefix for menu called functions
    var tocData = {};   // local cache of data from toc-data.json
    
    var bkAsideHtml = "views/bk-aside.html";
    var bkNavHtml = "views/bk-nav.html";
    var cbAsideHtml = "views/cb-aside.html";
    var cbNavHtml = "views/cb-nav.html";
    var cbNavJsonPath = "data/cb-nav.json";
    var dflAsideHtml = "views/dfl-aside.html";
    var dflMainHtml = "views/dfl-main.html";
    var p3AsideHtml = "views/p3-aside.html";
    var p3MainHtml = "views/p3-main.html";
    
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

    // On page load
    document.addEventListener("DOMContentLoaded", function (event) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        bkNavHtml,
        function (responseText) {
          document.querySelector("#main-content").innerHTML = responseText;
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
      
      /* Also fetch the cookbook data and store it in global tocData */
      fetch('data/toc-data.json')
        .then(response => response.json())
        .then(data => {
          tableOfContents = data; 
          tocData = tableOfContents;  
          // console.log(tocData);       
        })
      .catch(error => console.error("Error fetching JSON data:", error));
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

    mc.clearNav = function() {
      insertHtml("#main-content", "");
    }

    mc.clearAside = function() {
      insertHtml("#aside-content", "");
    }

    mc.clearArticle = function() {
      insertHtml("#recipe-title", "");
      insertHtml("#recipe-photo", "");
      insertHtml("#recipe-description", "");
    }

    // --------
    // COOKBOOK
    // --------
    mc.loadCbNav = function () {
      var headerId = "header-img";
      var headerH1 = "header-h1";
      var headerH4 = "header-h4";
      
      var header = document.getElementById(headerId);
      header.setAttribute('style', 'background-image: url("../images/bk-medium-white-logo.JPG")',
        'background-repeat:no-repeat;');
      
      document.getElementById(headerH1).innerHTML = "Blue Kitchen Cookbook";
      document.getElementById(headerH4).innerHTML = "a compilation of our family's favorites";
      showLoading("#cb-content");
      $ajaxUtils.sendGetRequest(
        cbNavHtml,
        function(cbNavHtml){
          // Switch CSS class active to menu button
          switchMenuToActive("#cb");
          mc.clearAside();
          mc.clearNav();
          insertHtml("#cb-content", cbNavHtml);
        },
        false
      );

      //mc.clearAside();
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
      // console.log("photo is " + photo);
      insertHtml("#recipe-photo", "<img src=images/recipes/"+ photo +"></img>");
    }

    loadRecipeTitle = function(id) {
      // id is of the form <short_name><recipes index>
      var short_name = id.charAt(0);
      var recipes_index = id.charAt(1);
      // console.log ("short_name is " + short_name);
      // console.log ("recipes_index is " + recipes_index);
      var catIndex = 0;

      for (var i = 0; i < tocData.length; i++){
        if (tocData[i].short_name == short_name) {
          catIndex = i;
          break;
        }
      } 

      var title = tocData[catIndex].recipes[recipes_index].title;
      // console.log("title is " + title);
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
        dflMainHtml,
        function(dflMainHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive("#dfl");
          insertHtml("#main-content", dflMainHtml);
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
        p3MainHtml,
        function(p3MainHtml){
          // Switch CSS class active to menu button
          // switchMenuToActive("#p3");
          insertHtml("#main-content", p3MainHtml);
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
  