const reveals =
    document.querySelectorAll(
        ".reveal"
    );

function reveal(){

    for(const element of reveals){

        const windowHeight =
            window.innerHeight;

        const elementTop =
            element.getBoundingClientRect().top;

        const revealPoint =
            100;

        if(
            elementTop <
            windowHeight - revealPoint
        ){
            element.classList.add(
                "active"
            );
        }

    }

}

window.addEventListener(
    "scroll",
    reveal
);

reveal();