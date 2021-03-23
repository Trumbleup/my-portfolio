const toggleMobileNav = () => {
    const mobileNavElement = document.querySelector(".link-wrap");
    if (mobileNavElement.classList.contains("visible")) {
        mobileNavElement.classList.remove("visible");
    } else {
        mobileNavElement.classList.add("visible");
    }
};

export default toggleMobileNav;