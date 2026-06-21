const contestList = document.getElementById("contest-list");

async function loadContests() {
    try {
        const response = await fetch(
            "https://codeforces.com/api/contest.list"
        );
        const data = await response.json();
        const upcomingContests = data.result.filter(
        contest => contest.phase === "BEFORE"
        );
        const contests =upcomingContests.slice(0, 5);
        contestList.innerHTML = "";

        for(const contest of contests){
            const card = document.createElement("div");
            card.classList.add("contest-card");
            const startTime = new Date(
                contest.startTimeSeconds * 1000
            ).toLocaleString();
            const durationHours = Math.floor(
                contest.durationSeconds / 3600
            );
            const durationMinutes = Math.floor(
                (contest.durationSeconds % 3600) / 60
            );
            const remainingTime = Math.floor(
                (contest.startTimeSeconds *1000-Date.now())
                /(1000 * 60 * 60 * 24)
            );
            card.innerHTML = `
                <h3>${contest.name}</h3>
                <div class="contest-details">
                    <p>
                        <strong>Starts:</strong>
                        ${startTime}
                    </p>
                    <p>
                        <strong>Duration:</strong>
                        ${durationHours}h ${durationMinutes}m
                    </p>
                    <p>
                        <strong>Type:</strong>
                        ${contest.type}
                    </p>
                    <p class="upcoming">
                        Upcoming in ${remainingTime} days
                    </p>
                </div>
            `;
            contestList.appendChild(card);
        }
    }

    catch(error) {
        console.log(error);
    }

}
loadContests();