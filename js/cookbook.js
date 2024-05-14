
var tableOfContents = '';
var tocLoaded = false;

document.addEventListener("DOMContentLoaded", function() {
  /* when page loads, fetch the data */
    fetch('data/toc-data.json')
        .then(response => response.json())
        .then(data => {
            tableOfContents = data; 
            console.log(tableOfContents);            
        })
        .catch(error => console.error("Error fetching JSON data:", error));
});

/* Load/clear the table of contents when Recipes menu item is clicked */
function loadTOC (){
  if (!tocLoaded) {
    const dataDisplay = document.getElementById("toc-tile");
    tocTable = document.createElement("table");
    for (i = 0; i < tableOfContents.length; i++){
      tocRowElement = document.createElement("tr");
      tocElement = document.createElement("a");
      chapter = document.createTextNode(tableOfContents[i].chapter);              
      tocElement.setAttribute("href", tableOfContents[i].recipes[0].recipe);
      tocElement.setAttribute("class", "recipe");
      tocElement.appendChild(chapter);
      tocRowElement.append(tocElement);
      tocTable.appendChild(tocRowElement);
    }
    tocTable.setAttribute("class", "recipe");
    dataDisplay.appendChild(tocTable); 
    tocLoaded = true;
  } else {
    /* clear the table of contents */
  }  
}