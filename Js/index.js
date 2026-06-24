const counters =
    document.querySelectorAll(
        ".counter"
    );

const observer =
    new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    const counter =
                        entry.target;
                    const target =
                        Number(
                            counter.dataset.target
                        );
                    let count = 0;
                    const updateCounter = () => {
                        const increment =
                            Math.ceil(
                                target / 100
                            );
                        count += increment;
                        if(count >= target){
                            counter.textContent =
                                target + "+";
                            return;
                        }
                        counter.textContent =
                            count + "+";
                        requestAnimationFrame(
                            updateCounter
                        );
                    };
                    updateCounter();
                    observer.unobserve(
                        counter
                    );
                }

            });

        },
        {
            threshold:0.5
        }
    );

counters.forEach(counter => {
    observer.observe(counter);
});