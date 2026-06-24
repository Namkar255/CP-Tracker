const glow =
    document.getElementById(
        "cursor-glow"
    );

document.addEventListener(
    "mousemove",
    function(event){

        glow.style.left =
            event.clientX + "px";

        glow.style.top =
            event.clientY + "px";

    }
);