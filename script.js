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

const home = document.querySelector("#home");
const about = document.querySelector("#about");
const portfolio = document.querySelector("#portfolio");
const contact = document.querySelector("#contact");

const scrollToHome = () => {
    home.scrollIntoView({
        behavior: 'smooth',
    });
}

const scrollToPortfolio = () => {
    portfolio.scrollIntoView({
        behavior: 'smooth',
    });
}

const nav = document.querySelector('nav');
const topOfAbout = about.offsetTop;

const fixNav = () => {
    if (window.scrollY >= topOfAbout + nav.offsetHeight) {
        document.body.classList.add('fixed-nav');
    } else {
        document.body.classList.remove('fixed-nav');
    }
}

window.addEventListener('scroll', fixNav);

