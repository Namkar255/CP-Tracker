const currentPath =
    window.location.pathname;

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );
for(const link of navLinks){
    const href =
        link.getAttribute(
            "href"
        );
    if(href === currentPath){
        link.classList.add(
            "active"
        );

    }

}