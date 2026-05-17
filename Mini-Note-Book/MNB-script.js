const page = document.getElementById("page");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

let bookPages = [];

let currentPageIndex = 0;


/* FETCH PAGES */

async function loadPages() {
    const response = await fetch("pages.json");
    bookPages = await response.json();
    loadPage(currentPageIndex);
}


/* LOAD PAGE */

function loadPage(index) {
    page.classList.add("animate");
    setTimeout(() => {
        page.innerHTML = bookPages[index].content;
    }, 300);

    setTimeout(() => {
        page.classList.remove("animate");
    }, 300);
}


/* NEXT BUTTON */

nextButton.addEventListener("click", function () {
    if (currentPageIndex < bookPages.length - 1) {
        currentPageIndex++;
        loadPage(currentPageIndex);
    }
});


/* PREVIOUS BUTTON */

previousButton.addEventListener("click", function () {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        loadPage(currentPageIndex);
    }
});


/* START */

loadPages();