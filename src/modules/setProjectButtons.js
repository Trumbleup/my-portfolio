import setModal from "./setModal.js";
import setProjectInfo from "./setProjectInfo";


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