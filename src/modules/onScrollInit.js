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

export default onScrollInit;