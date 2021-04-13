import shiftSlide from "./shiftSlide.js";

const setModalEvents = () => {
    const modalMask = document.querySelector(".mask");
    const modalWrap = document.querySelector(".modal-wrap");
    const closeIcon = document.querySelector(".modal i");
    const nextButton = document.querySelector("#next");
    const prevButton = document.querySelector("#prev");

    const closeModal = () => {
        modalWrap.classList.remove("visible");
    };
    modalMask.addEventListener("click", closeModal);
    closeIcon.addEventListener("click", closeModal);
};

export default setModalEvents;