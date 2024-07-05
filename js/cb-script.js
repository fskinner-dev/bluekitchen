// $(function () {
//     // Same as document.addEventListener("DOMContentLoaded"...
//   });
(function (global) {
    var mc = {};       // mc prefix for menu called functions
    var cbData = {};   // local cache of data from cb-data.json
    var cbNavJsonPath = "data/cb-nav.json";
    var cbAsideHtml = "views/cb-aside.html";
    var cbNavHtml = "views/cb-nav.html";
    
    //-------------------------
    // LOCAL UTILITY FUNCTIONS 
    //-------------------------
    
    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };

    // Return substitute of '{{propName}}' with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    };

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

    mc.loadCbNav = function () {
      /* fetch the cookbook data and store it in global cbData */
      fetch('data/cb-data.json')
       .then(response => response.json())
        .then(data => {
          cbData = data; 
          console.log(cbData);       
        })
        .catch(error => console.error("Error fetching JSON data:", error));
    
      $ajaxUtils.sendGetRequest(
        cbNavHtml,
        function(cbNavHtml){
          console.log(cbNavHtml);
          insertHtml("#cb-content", cbNavHtml);
        },
        false
      );

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
      loadRecipeDescription(id);
    }

    

// ------------------do not cross------------------ //
global.$mc = mc;
})(window);