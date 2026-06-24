const cards =
    document.querySelectorAll(
        ".feature-card, .stat-card"
    );

cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        function(event){

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateY =
                (x - centerX) / 15;

            const rotateX =
                (centerY - y) / 15;

            card.style.transform =
                `perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)`;

        }
    );

    card.addEventListener(
        "mouseleave",
        function(){

            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";

        }
    );

});