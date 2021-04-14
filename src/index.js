import setNavLinksEvents from "./modules/setNavLinksEvents";
import setHighlightTextEvent from "./modules/setHighlightTextEvent";
import onScrollInit from "./modules/onScrollInit";
import toggleMobileNav from "./modules/toggleMobileNav";
import fixNav from "./modules/fixNav";
import setProjectButtons from "./modules/setProjectButtons"
import setModalEvents from "./modules/setModalEvents";
import shiftSlide from "./modules/shiftSlide";
import contact from "./modules/contact";



const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
    shiftSlide(-1);
});
const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", () => {
    shiftSlide(1);
});


window.addEventListener('scroll', fixNav);
window.addEventListener('scroll', setHighlightTextEvent);
document.querySelector(".bar-icon").addEventListener("click", toggleMobileNav);
onScrollInit(document.querySelectorAll(".waypoint"));
setNavLinksEvents();
setProjectButtons();
setModalEvents();
contact();