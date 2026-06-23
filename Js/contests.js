const contestList = document.getElementById("contest-list");
const savedContestList =document.getElementById("saved-contest-list");

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
                    <button class="save-btn">
                        Save Contest
                    </button>
                </div>
            `;
            const saveButton =
                card.querySelector(
                    ".save-btn"
                );
            saveButton.addEventListener(
                "click",
                function(){
                    saveContest(
                        contest
                    );
                }
            );
            contestList.appendChild(card);
        }
    }

    catch(error) {
        console.log(error);
    }

}
async function saveContest(
    contest
){
    try{
        await fetch(
            "/api/contests/save",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    contest_name:
                        contest.name,

                    platform:
                        "Codeforces",

                    contest_link:
                        "https://codeforces.com/contests",

                    contest_time:
                        contest.startTimeSeconds
                })
            }
        );
        loadSavedContests();
    }
    catch(error){

        console.log(error);

    }

}
async function loadSavedContests(){

    try{

        const response =
            await fetch(
                "/api/contests/saved"
            );

        const contests =
            await response.json();

        savedContestList.innerHTML = "";

        for(
            const contest
            of contests
        ){

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "contest-card"
            );

            const startTime =
                new Date(
                    contest.contest_time
                    * 1000
                ).toLocaleString();

            card.innerHTML = `
                <h3>
                    ${contest.contest_name}
                </h3>

                <p>
                    ${contest.platform}
                </p>

                <p>
                    ${startTime}
                </p>

                <button
                    class="delete-contest-btn"
                >
                    Remove
                </button>
            `;

            const deleteButton =
                card.querySelector(
                    ".delete-contest-btn"
                );

            deleteButton.addEventListener(
                "click",
                async function(){

                    await fetch(
                        `/api/contests/${contest.id}`,
                        {
                            method:"DELETE"
                        }
                    );

                    loadSavedContests();

                }
            );

            savedContestList.appendChild(
                card
            );

        }

    }
    catch(error){

        console.log(error);

    }

}
loadContests();
loadSavedContests();