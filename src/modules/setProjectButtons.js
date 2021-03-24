const setProjectButtons = () => {
    const projectButtons = document.querySelectorAll(".project-button");
    projectButtons.forEach(button => {
        button.classList.add("visible")
    });
};

export default setProjectButtons;