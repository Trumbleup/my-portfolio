import axios from "axios";

const formSuccess = (element) => {
    element.textContent = "Thank you!";
    element.classList = "confirm success";
}

const formError = (element) => {
    element.textContent = "There was an error, please try again!";
    element.classList = "confirm error";
}

const contact = async () => {
    const myForm = document.getElementById("contact-form");
    myForm.addEventListener("submit", (e) => {
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
        const confirm = document.querySelector(".confirm");
        e.preventDefault();
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
        }).then((response) => { formSuccess(confirm); })
        .catch(error => { formError(confirm) });
    })
}

export default contact;