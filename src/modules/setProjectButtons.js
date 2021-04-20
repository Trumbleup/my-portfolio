import modalText from "./modalText.js";
import setModal from "./setModal.js";

const setProjectInfo = (id) => {
    const projectTitle = document.querySelector(".modal .title");
    projectTitle.innerHTML = modalText[id].title;

    const projectInfo = document.querySelector(".modal .info");
    projectInfo.innerHTML = modalText[id].info;

    const projectDetails = document.querySelector(".modal .details");
    projectDetails.innerHTML = modalText[id].details;

    const projectLink = document.querySelector(".modal .link");
    projectLink.href = modalText[id].link;

    const modalSlides = document.querySelectorAll(".modal .slide");
    modalSlides.forEach((slide, index) => {
        slide.style.background = `url("./assets/images/slides/${id}-slide-${index}.PNG") center center/cover`;
        slide.style.backgroundSize = "cover";
    });
};

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