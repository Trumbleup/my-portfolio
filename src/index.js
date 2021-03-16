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

}



const setNavLinksEvents = () => {
    const navLinks = document.querySelectorAll(".page-link");
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', scrollToSection);
    });
}




const fixNav = () => {
    const nav = document.querySelector('nav');
    const about = document.getElementById('about');
    const topOfAbout = about.offsetTop;

    if (window.scrollY >= topOfAbout + nav.offsetHeight) {
        document.body.classList.add('fixed-nav');
    } else if (window.scrollY <= topOfAbout){
        document.body.classList.remove('fixed-nav');
    }
}

window.addEventListener('scroll', fixNav);
setNavLinksEvents();