import modalText from "./modalText.js";

const setProjectInfo = (id) => {
    const projectTitle = document.querySelector(".modal .title");
    projectTitle.innerHTML = modalText[id].title;

    const projectInfo = document.querySelector(".modal .info");
    projectInfo.innerHTML = modalText[id].info;

    const projectDetails = document.querySelector(".modal .details");
    projectDetails.innerHTML = modalText[id].details;
    
}

const setModal = () => {
    const modalWrap = document.querySelector(".modal-wrap");
    modalWrap.classList.add("visible");
}

const setProjectButtons = () => {
    const projectButtons = document.querySelectorAll(".project-button");
    projectButtons.forEach(button => {
        button.addEventListener("click", setModal);
        button.addEventListener("click", () => {
            setProjectInfo(button.id);
        });
    });
};


export default setProjectButtons;