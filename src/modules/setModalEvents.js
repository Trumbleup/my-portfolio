const setModalEvents = () => {
    const modalMask = document.querySelector(".mask");
    const modalWrap = document.querySelector(".modal-wrap");
    modalMask.addEventListener("click", () => {
        modalWrap.classList.remove("visible");
        console.log("hi");
    });
};

export default setModalEvents;