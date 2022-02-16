const slide = document.querySelectorAll('.slide');
const dot = document.querySelectorAll('.dot');
let counter = 1;
imageSlide(counter);

let timer = setInterval(autoSlide, 6000);
function autoSlide() {
    counter += 1;
    imageSlide(counter);
}
function plusSlides(n) {
    counter += n;
    imageSlide(counter);
    resetTimer();
}
function currentSlide(n) {
    counter = n;
    imageSlide(counter);
    resetTimer();
}
function resetTimer() {
    clearInterval(timer);
    timer = setInterval(autoSlide, 8000);
}

function imageSlide(n) {

    let i;
    for (i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
    }
    for (i = 0; i < dot.length; i++) {
        dot[i].className = dot[i].className.replace(' active', '');
    }
    if (n > slide.length) {
        counter = 1;
    }
    if (n < 1) {
        counter = slide.length;
    }
    slide[counter - 1].style.display = "flex";
    dot[counter - 1].className += " active";
}