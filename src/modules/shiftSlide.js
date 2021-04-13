const shiftSlide = (direction) => {
    const slider = document.querySelector(".slider");
    slider.classList.add("transition");
    slider.style.transform = `translateX(${direction * 700}px)`;
    console.log("before timeout");
    setTimeout(() => {
        // debugger;
        if (direction == 1) {
            document.querySelector(".slide:first-child").before(document.querySelector(".slide:last-child"));
            console.log("hi");
        } else if (direction == -1) {
            document.querySelector(".slide:last-child").after(document.querySelector(".slide:first-child"));
            console.log("-hi");
        }
        slider.classList.remove("transition");
        slider.style.transform = `translateX(0px)`;
    }, 700);  
}



export default shiftSlide;