$(function () {
    // Same as document.addEventListener("DOMContentLoaded"...
  
    // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
    // $("#navbarToggle").blur(function (event) {
    //   var screenWidth = window.innerWidth;
    //   if (screenWidth < 768) {
    //     $("#collapsable-nav").collapse("hide");
    //   }
    // });
  
    // In Firefox and Safari, the click event doesn't retain the focus
    // on the clicked button. Therefore, the blur event will not fire on
    // user clicking somewhere else in the page and the blur event handler
    // which is set up above will not be called.
    // Refer to issue #28 in the repo.
    // Solution: force focus on the element that the click event fired on
    // $("#navbarToggle").click(function (event) {
    //   $(event.target).focus();
    // });
  });
  
  (function (global) {
    var dc = {};
    var data = {};   // we will cache the category data locally in this variable
    var recipeData = {};  // cache recipe data for other recipes.  May need a flag so we don't keep loading this 
    var selectedRecipe = null; // this is the recipe the user selected... until we refactor  
  
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
      "https://fskinner-dev.github.io/bluekitchen/data/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";
    var recipeTitleHtml = "snippets/recipe-title.html";
    var recipeDetailHtml = "snippets/recipe-detail.html";
    var allRecipesUrl = "https://fskinner-dev.github.io/bluekitchen/data/recipes.json";
    
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
  
    // Return substitute of '{{propName}}'
    // with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    };
  
    // Remove the class 'active' from home and switch to Menu button
    var switchMenuToActive = function () {
      // Remove 'active' from home button
      var classes = document.querySelector("#navHomeButton").className;
      classes = classes.replace(new RegExp("active", "g"), "");
      document.querySelector("#navHomeButton").className = classes;
  
      // Add 'active' to menu button if not already there
      classes = document.querySelector("#navMenuButton").className;
      if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navMenuButton").className = classes;
      }
    };
  
    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
      // On first load, show home view
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          document.querySelector("#main-content").innerHTML = responseText;
        },
        false
      );
    });
  
    // Load the menu categories view
    dc.loadMenuCategories = function () {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };
  
    // Load the menu items view
    // 'categoryShort' is a short_name for a category
    dc.loadMenuItems = function (categoryShort) {
      showLoading("#main-content");
    // extract the recipe titles in this category (categoryShort)
    // new list to contain recipe titles in this category
    var recipeTitles = [];
    var categoryTitle = null;
    var shortName = null;

    // loop through data looking for category short name.
    for (i = 0; i < data.length; i++){
      if (data[i].short_name == categoryShort) {
        shortName = data[i].short_name;
        categoryTitle = data[i].name;
        // extract the recipe titles from this category into the new list
        for (j = 0; j < data[i].recipes.length; j++){
            recipeTitles[j] = data[i].recipes[j].recipe;
        }
        // break;
      }
    }  
    buildAndShowMenuItemsHTML(shortName, categoryTitle, recipeTitles)
  };

  dc.loadRecipe = function(recipe) {  // passing in the recipe we need but recipes json isn't loaded yet
    showLoading("#main-content");
    selectedRecipe = recipe;
    $ajaxUtils.sendGetRequest(allRecipesUrl, buildAndShowRecipeHtml);
  };

  dc.loadTocImage = function(tocShortName){
    var html = tocShortName+"<img src='images/spices25.jpg'></div>";
      insertHtml('#display-image', html);
  };

  dc.hideTocImage = function(tocShortName){

    var html = "";
      insertHtml('#display-image', html); 
  };    

    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowCategoriesHTML(categories) {
        // now that we have the categories data in-hand, let's cache it!
        data = categories;
        // console.log(data);    // confirms we have the data

      // Load title snippet of categories page
      $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {
          // Retrieve single category snippet
          $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
              // Switch CSS class active to menu button
              switchMenuToActive();
  
              var categoriesViewHtml = buildCategoriesViewHtml(
                categories,
                categoriesTitleHtml,
                categoryHtml
              );
              insertHtml("#main-content", categoriesViewHtml);
            },
            false
          );
        },
        false
      );
    }
  
    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(
      categories,
      categoriesTitleHtml,
      categoryHtml
    ) {
      var finalHtml = categoriesTitleHtml;
      finalHtml += "<section class='row'>";
  
      // Loop over categories
      for (var i = 0; i < categories.length; i++) {
        // Insert category values
        var html = categoryHtml;
        var name = "" + categories[i].name;
        var short_name = categories[i].short_name;
        html = insertProperty(html, "name", name);
        html = insertProperty(html, "short_name", short_name);
        finalHtml += html;
      }
  
      finalHtml += "</section>";
      return finalHtml;
    }
  
    // Builds HTML for the single category page based on the data
    // from the server
    function buildAndShowMenuItemsHTML(shortName, categoryTitle, recipeTitles) {
      // Load title snippet of menu items page
      $ajaxUtils.sendGetRequest(
        menuItemsTitleHtml,
        function (menuItemsTitleHtml) {
          // Retrieve single menu item snippet
          $ajaxUtils.sendGetRequest(
            menuItemHtml,
            function (menuItemHtml) {
              // Switch CSS class active to menu button
              switchMenuToActive();
  
              var menuItemsViewHtml = buildMenuItemsViewHtml(shortName, categoryTitle, recipeTitles, menuItemsTitleHtml, menuItemHtml);
              insertHtml("#main-content", menuItemsViewHtml);
            },
            false
          );
        },
        false
      );
    }

    function buildAndShowRecipeHtml(recipes){
        recipeData = recipes; 
        $ajaxUtils.sendGetRequest(
          recipeTitleHtml,
          function (recipeTitleHtml) {
            // Retrieve single recipe snippet
               $ajaxUtils.sendGetRequest(
                 recipeDetailHtml,
                 function (recipeDetailHtml) {
                   // Switch CSS class active to menu button
                   switchMenuToActive();       
                  var recipeViewHtml = buildRecipeViewHtml(selectedRecipe, recipeData, recipeTitleHtml, recipeDetailHtml);
                   insertHtml("#main-content", recipeViewHtml);
                 },
                 false
               );
             },
             false
           );     
      } 

    function buildMenuItemsViewHtml(shortName, categoryTitle, recipeTitles, menuItemsTitleHtml, menuItemHtml) {
      menuItemsTitleHtml = insertProperty(
        menuItemsTitleHtml,
        "name",
        categoryTitle
      );
  
      var finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";
  
      // Loop over menu items
     for (var i = 0; i < recipeTitles.length; i++) {
        // Insert menu item values
        var html = menuItemHtml;
        html = insertProperty(html, "recipe", recipeTitles[i]);

        // Add clearfix after every second menu item
        if (i % 2 != 0) {
          html +=
            "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }
  
        finalHtml += html;
      }
  
      finalHtml += "</section>";
      return finalHtml;
    }

      function buildRecipeViewHtml(selectedRecipe, recipeData, recipeTitleHtml, recipeDetailHtml) {
        recipeTitleHtml = insertProperty(
          recipeTitleHtml,
          "recipeTitle",
          selectedRecipe
        );
    
        var finalHtml = recipeTitleHtml;
        finalHtml += "<section class='row'>";
    
        // Loop over recipes and extract details for selected recipe
        for (var i = 0; i < recipeData.length; i++) {
          if (recipeData[i].name == selectedRecipe){
            var html = recipeDetailHtml;
            html = insertProperty(html, "recipeHaiku", recipeData[i].haiku);
            html = insertProperty(html, "recipeIngredients", recipeData[i].ingredients);
            html = insertProperty(html, "recipeDirections", recipeData[i].directions);
            finalHtml += html;
          }
      
          // Add clearfix after every second menu item
          if (i % 2 != 0) {
            html +=
              "<div class='clearfix visible-lg-block visible-md-block'></div>";
          }
        }
    
        finalHtml += "</section>";
        return finalHtml;
      }
  


// ------------------do not cross------------------ //
    global.$dc = dc;
  })(window);
  