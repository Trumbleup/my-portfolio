import setNavLinksEvents from "./modules/setNavLinksEvents";
import setHighlightTextEvent from "./modules/setHighlightTextEvent";
import onScrollInit from "./modules/onScrollInit";
import toggleMobileNav from "./modules/toggleMobileNav";
import fixNav from "./modules/fixNav";


window.addEventListener('scroll', fixNav);
window.addEventListener('scroll', setHighlightTextEvent);
document.querySelector(".bar-icon").addEventListener("click", toggleMobileNav);
onScrollInit(document.querySelectorAll(".waypoint"));
setNavLinksEvents();