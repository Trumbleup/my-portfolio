/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const modalText = {
    fruition: {
        title: "Fruition Tech Labs",
        tag: "Business and Technology Commercialization Company",
        detail: "Elit proident voluptate labore laborum voluptate sunt exercitation ullamco dolore non dolore sunt adipisicing pariatur. Pariatur quis fugiat cillum cupidatat ut officia. Sit Lorem voluptate commodo laboris laboris labore ad.",
        link: "",
    },
    jsleeve: {
        title: "Synergy Svn",
        tag: "Athletic Tech Company",
        detail: "Incididunt eu cillum reprehenderit anim sunt commodo aute. Nostrud incididunt pariatur officia reprehenderit irure consectetur qui tempor aliqua nulla ullamco. Eu nisi aliquip sit cillum laboris enim est ullamco sint id. Tempor consequat enim laborum nostrud in. Sunt commodo aliqua id laboris elit et reprehenderit.",
        link: "",
    }
};

const navLinks = document.querySelectorAll(".page-link");

const scrollToSection = (event) => {
    const destination = document.querySelector(`#${event.target.getAttribute("data-link")}`);
    destination.scrollIntoView({
        behavior: 'smooth',
    });

}

navLinks.forEach(navLink => {
    navLink.addEventListener('click', scrollToSection);
});

const nav = document.querySelector('nav');
const topOfAbout = about.offsetTop;

const fixNav = () => {
    if (window.scrollY >= topOfAbout + nav.offsetHeight) {
        document.body.classList.add('fixed-nav');
    } else if (window.scrollY <= topOfAbout){
        document.body.classList.remove('fixed-nav');
    }
}

window.addEventListener('scroll', fixNav);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxtREFBbUQsdUNBQXVDO0FBQzFGO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSwwQyIsImZpbGUiOiJpbmRleC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtb2RhbFRleHQgPSB7XHJcbiAgICBmcnVpdGlvbjoge1xyXG4gICAgICAgIHRpdGxlOiBcIkZydWl0aW9uIFRlY2ggTGFic1wiLFxyXG4gICAgICAgIHRhZzogXCJCdXNpbmVzcyBhbmQgVGVjaG5vbG9neSBDb21tZXJjaWFsaXphdGlvbiBDb21wYW55XCIsXHJcbiAgICAgICAgZGV0YWlsOiBcIkVsaXQgcHJvaWRlbnQgdm9sdXB0YXRlIGxhYm9yZSBsYWJvcnVtIHZvbHVwdGF0ZSBzdW50IGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGRvbG9yZSBub24gZG9sb3JlIHN1bnQgYWRpcGlzaWNpbmcgcGFyaWF0dXIuIFBhcmlhdHVyIHF1aXMgZnVnaWF0IGNpbGx1bSBjdXBpZGF0YXQgdXQgb2ZmaWNpYS4gU2l0IExvcmVtIHZvbHVwdGF0ZSBjb21tb2RvIGxhYm9yaXMgbGFib3JpcyBsYWJvcmUgYWQuXCIsXHJcbiAgICAgICAgbGluazogXCJcIixcclxuICAgIH0sXHJcbiAgICBqc2xlZXZlOiB7XHJcbiAgICAgICAgdGl0bGU6IFwiU3luZXJneSBTdm5cIixcclxuICAgICAgICB0YWc6IFwiQXRobGV0aWMgVGVjaCBDb21wYW55XCIsXHJcbiAgICAgICAgZGV0YWlsOiBcIkluY2lkaWR1bnQgZXUgY2lsbHVtIHJlcHJlaGVuZGVyaXQgYW5pbSBzdW50IGNvbW1vZG8gYXV0ZS4gTm9zdHJ1ZCBpbmNpZGlkdW50IHBhcmlhdHVyIG9mZmljaWEgcmVwcmVoZW5kZXJpdCBpcnVyZSBjb25zZWN0ZXR1ciBxdWkgdGVtcG9yIGFsaXF1YSBudWxsYSB1bGxhbWNvLiBFdSBuaXNpIGFsaXF1aXAgc2l0IGNpbGx1bSBsYWJvcmlzIGVuaW0gZXN0IHVsbGFtY28gc2ludCBpZC4gVGVtcG9yIGNvbnNlcXVhdCBlbmltIGxhYm9ydW0gbm9zdHJ1ZCBpbi4gU3VudCBjb21tb2RvIGFsaXF1YSBpZCBsYWJvcmlzIGVsaXQgZXQgcmVwcmVoZW5kZXJpdC5cIixcclxuICAgICAgICBsaW5rOiBcIlwiLFxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhZ2UtbGlua1wiKTtcclxuXHJcbmNvbnN0IHNjcm9sbFRvU2VjdGlvbiA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1saW5rXCIpfWApO1xyXG4gICAgZGVzdGluYXRpb24uc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxubmF2TGlua3MuZm9yRWFjaChuYXZMaW5rID0+IHtcclxuICAgIG5hdkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxUb1NlY3Rpb24pO1xyXG59KTtcclxuXHJcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpO1xyXG5jb25zdCB0b3BPZkFib3V0ID0gYWJvdXQub2Zmc2V0VG9wO1xyXG5cclxuY29uc3QgZml4TmF2ID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID49IHRvcE9mQWJvdXQgKyBuYXYub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmaXhlZC1uYXYnKTtcclxuICAgIH0gZWxzZSBpZiAod2luZG93LnNjcm9sbFkgPD0gdG9wT2ZBYm91dCl7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZC1uYXYnKTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZpeE5hdik7Il0sInNvdXJjZVJvb3QiOiIifQ==