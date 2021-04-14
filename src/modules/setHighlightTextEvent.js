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
    if (window.scrollY >= contact.offsetTop - 200) {
        highlightText("contact");
    }
};

export default setHighlightTextEvent;