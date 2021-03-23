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

export default setNavLinksEvents;