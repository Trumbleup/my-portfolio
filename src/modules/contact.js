const contact = async () => {
    const myForm = document.getElementById("contact-form");

    myForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(this);

        fetch("https://formspree.io/f/xzbyzplk", {
            method: "post",
            body: JSON.stringify(formData),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
    })
}

export default contact;