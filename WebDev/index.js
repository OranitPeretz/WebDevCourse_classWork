//--Page to navigate when clicked menue item
// page: from HTML CLICK () /page:/01/demos/index.html
function loadPage(page) {

    // Get reference for the HTML ELEMENT BY ITS ID
    // contentFrame is iframe element type
    let iframeElement = document.getElementById("contentFrame");

    //Give the iframe the HTML ADDRESS
    iframeElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}