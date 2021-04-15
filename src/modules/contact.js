import axios from "axios";

const formSuccess = (element) => {
    element.textContent = "Thank you!";
    element.classList = "confirm success";
}

const formError = (element) => {
    element.textContent = "There was an error, please try again!";
    element.classList = "confirm error";
}

const formPending = (element) => {
    element.classList.add("pending");
};

const removeFormPending = (element) => {
    element.classList.remove("pending");
};

const handlePending = () => {
    const pendingIcon = document.querySelector("#contact i");
    if (pendingIcon.classList.contains("pending")) {
        removeFormPending(pendingIcon);
    } else {
        formPending(pendingIcon);
    }
};


const contact = async () => {
    const myForm = document.getElementById("contact-form");
    myForm.addEventListener("submit", (e) => {
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
        const confirm = document.querySelector(".confirm");
        const pendingIcon = document.querySelector("#contact i");
        e.preventDefault();
        handlePending();
        axios({
            url: "https://formspree.io/f/xzbyzplk",
            method: "post",
            headers: {
                "Accept": 'application/json'
            },
            data: {
                name: name,
                email: email,
                message: message
            }
        })
        .then((response) => {
                handlePending();
                formSuccess(confirm); 
        })
        .catch(error => {
                handlePending();
                formError(confirm);
        });
    });
};

export default contact;