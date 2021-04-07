import modalText from "./modalText.js";

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
        slide.style.background = `url("./images/slides/${id}-slide-${index}.PNG") center center/cover`;
        slide.style.backgroundSize = "cover";
    });
};

const shiftSlide = (direction) => {
    const slider = document.querySelector(".slider");
    slider.classList.add("transition");
    slider.style.transform = `translateX(${direction} * 700px)`;
    if (direction == 1) {
        document.querySelector(".slide:first-child").before(document.querySelector(".slide:last-child"));
        console.log("hi");
    } else if (direction == -1) {
        document.querySelector(".slide:last-child").after(document.querySelector(".slide:first-child"));
        console.log("-hi");
    }
    slider.classList.remove("transition");
}

const setModal = () => {
    const modalWrap = document.querySelector(".modal-wrap");
    modalWrap.classList.add("visible");

    const nextButton = document.querySelector("#next");
    nextButton.addEventListener("click", () => {
        shiftSlide(-1);
    });
    const prevButton = document.querySelector("#prev");
    prevButton.addEventListener("click", () => {
        shiftSlide(1);
    });
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