const setModal = () => {
    const modalWrap = document.querySelector(".modal-wrap");
    modalWrap.classList.add("visible");
}

const setProjectButtons = () => {
    const projectButtons = document.querySelectorAll(".project-button");
    projectButtons.forEach(button => {
        button.addEventListener("click", setModal);
    });
};


export default setProjectButtons;