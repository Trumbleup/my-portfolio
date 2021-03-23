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

export default fixNav;