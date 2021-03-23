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

const scrollToSection = (event) => {
    const destination = document.querySelector(`#${event.target.getAttribute("data-link")}`);
    destination.scrollIntoView({
        behavior: 'smooth',
    });
};

const setNavLinksEvents = () => {
    const navLinks = document.querySelectorAll(".page-link");
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', scrollToSection);
    });
};

const fixNav = () => {
    const nav = document.querySelector('nav');
    const about = document.getElementById('about');
    const topOfAbout = about.offsetTop;

    if (window.scrollY >= topOfAbout + nav.offsetHeight) {
        document.body.classList.add('fixed-nav');
    } else if (window.scrollY <= topOfAbout){
        document.body.classList.remove('fixed-nav');
    }
};

const highlightText = (anchor) => {
    const activeLink = document.querySelector("nav .link-wrap .active");
    activeLink.classList.remove("active");

    const newActiveLink = document.querySelector(`nav .link-wrap [data-link="${anchor}"]`);
    newActiveLink.classList.add("active");
}

const setHighlightTextEvent = () => {
    const home = document.getElementById('home');
    const about = document.getElementById('about');
    const portfolio = document.getElementById('portfolio');
    const contact = document.getElementById('contact');

    if (window.scrollY >= home.offsetTop && window.scrollY <= about.offsetTop) {
        highlightText("home");
    }
    if (window.scrollY >= about.offsetTop && window.scrollY <= portfolio.offsetTop) {
        highlightText("about");
    } 
    if (window.scrollY >= portfolio.offsetTop && window.scrollY <= contact.offsetTop) {
        highlightText("portfolio");
    }
    if (window.scrollY >= contact.offsetTop) {
        highlightText("contact");
    }
};

const onScrollInit = (elements) => {
    elements.forEach(element => {
        const dataAnimation = element.getAttribute(`data-animation`);
        const dataDelay = element.getAttribute('data-delay');
        window.addEventListener('scroll', () => {
            if (window.scrollY >= element.offsetTop - 550) {
                element.classList.add(dataAnimation);
                element.style = `animation-delay: ${dataDelay}`;
            }
        });
    });
};

const toggleMobileNav = () => {
    const mobileNavElement = document.querySelector(".mobile-link-wrap");
    if (mobileNavElement.classList.contains("visible")) {
        mobileNavElement.classList.remove("visible");
    } else {
        mobileNavElement.classList.add("visible");
    }
};


window.addEventListener('scroll', fixNav);
window.addEventListener('scroll', setHighlightTextEvent);
document.querySelector(".bar-icon").addEventListener("click", toggleMobileNav);
onScrollInit(document.querySelectorAll(".waypoint"));
setNavLinksEvents();