import axios from "axios";

const contact = async () => {
    const myForm = document.getElementById("contact-form");
    myForm.addEventListener("submit", (e) => {
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
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
        }).then((response) => { console.log(response); })
    })
}

export default contact;