
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const pages = document.querySelectorAll(".page");

let currentPageIndex = 0;

pages[currentPageIndex].classList.add("active");

previousButton.addEventListener("click", function () {

    if (currentPageIndex > 0) {

        pages[currentPageIndex].classList.remove("active");

        currentPageIndex--;

        pages[currentPageIndex].classList.add("active");
    }

});

nextButton.addEventListener("click", function () {

    if (currentPageIndex < pages.length - 1) {

        pages[currentPageIndex].classList.remove("active");

        currentPageIndex++;

        pages[currentPageIndex].classList.add("active");
    }

});