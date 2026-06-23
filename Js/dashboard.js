const fetchBtn = document.getElementById("fetch-btn");
const handleInput = document.getElementById("cf-handle");
const rating = document.getElementById("cf-rating");
const rank = document.getElementById("cf-rank");
const maxRating = document.getElementById("cf-max-rating");
const maxRank = document.getElementById("cf-max-rank");
const contribution = document.getElementById("cf-contribution");
const friendOfCount = document.getElementById("cf-friend-of-count");
const avatar = document.getElementById("cf-avatar");
const contestList = document.getElementById("contest-list");
const activityList = document.getElementById("activity-list");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const saveLCButton =document.getElementById("save-lc-handle");


async function fetchCodeforcesProfile(handle){
    const response =
        await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`
        );
    const data =
        await response.json();
    const user =
        data.result[0];
    document.getElementById(
        "cf-rating"
    ).textContent =
        user.rating ?? "--";
    document.getElementById(
        "cf-rank"
    ).textContent =
        user.rank ?? "--";
    document.getElementById(
        "cf-max-rating"
    ).textContent =
        user.maxRating ?? "--";
    document.getElementById(
        "cf-max-rank"
    ).textContent =
        user.maxRank ?? "--";
    document.getElementById(
        "cf-contribution"
    ).textContent =
        user.contribution ?? "--";
    document.getElementById(
        "cf-friend-of-count"
    ).textContent =
        user.friendOfCount ?? "--";
    document.getElementById(
        "cf-avatar"
    ).src =
        user.titlePhoto;

}
fetchBtn.addEventListener(
    "click",
    async function(){
        const handle =
            document
            .getElementById(
                "cf-handle"
            )
            .value
            .trim();
        if(handle === ""){
            return;
        }
        fetchCodeforcesProfile(
            handle
        );

    }
);
async function loadDashboard(){
    try{
        const response =
            await fetch("/api/dashboard");

        const data =
            await response.json();

        document.getElementById(
            "total-goals"
        ).textContent =
            data.totalGoals;

        document.getElementById(
            "completed-goals"
        ).textContent =
            data.completedGoals;

        document.getElementById(
            "active-goals"
        ).textContent =
            data.activeGoals;

        document.getElementById(
            "progress-fill"
        ).style.width =
            data.completionPercentage + "%";

        document.getElementById(
            "progress-text"
        ).textContent =
            data.completionPercentage + "%";
        const activityList =
        document.getElementById(
            "activity-list"
        );
        activityList.innerHTML = "";
        if(data.recentGoals.length === 0){
            activityList.innerHTML =
                "<li>No completed goals yet</li>";
        }
        else{
            for(const goal of data.recentGoals){
                const item =
                    document.createElement("li");
                item.textContent =
                    "Completed: " +
                    goal.goal_text;
                activityList.appendChild(
                    item
                );
            }
        }
    }
    catch(error){
        console.log(error);

    }
}
const saveCFButton =
    document.getElementById(
        "save-cf-handle"
    );

async function loadSavedHandle(){
    try{
        const response =
            await fetch(
                "/api/cf-handle"
            );
        const data =
            await response.json();
        if(data.cf_handle){
            document.getElementById(
                "saved-cf-handle"
            ).value =
                data.cf_handle;
        }
        await fetchCodeforcesProfile(
            data.cf_handle
        );
    }
    catch(error){
        console.log(error);
    }

}
saveCFButton.addEventListener("click",async function(){
        const cfHandle =document.getElementById("saved-cf-handle").value.trim();
        if(cfHandle === ""){
            return;
        }
        await fetch(
            "/api/cf-handle",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    cfHandle
                })
            }
        );
        const saveMessage =
            document.getElementById(
                "save-message"
            );
        saveMessage.textContent ="✓ Handle saved successfully";
        await fetchCodeforcesProfile(
            cfHandle
        );
        setTimeout(() => {
            saveMessage.textContent = "";
        }, 3000);
    }
);
async function loadUser(){
    try{
        const response =
            await fetch("/api/user");
        const user =
            await response.json();
        document.getElementById(
            "username"
        ).textContent =
            `Welcome, ${user.name}`;
    }
    catch(error){
        console.log(error);
    }

}
async function loadLeetCodeHandle(){
    try{
        const response = await fetch("/api/leetcode-handle");
        const data = await response.json();
        if(data.leetcode_handle){
            document.getElementById("saved-lc-handle").value =data.leetcode_handle;
            await fetchLeetCodeProfile(data.leetcode_handle);
            await fetchLeetCodeStats(data.leetcode_handle);
        }

    }
    catch(error){
        console.log(error);
    }

}
saveLCButton.addEventListener(
    "click",
    async function(){
        const leetcodeHandle =document.getElementById("saved-lc-handle").value.trim();
        if(leetcodeHandle === ""){
            return;
        }
        await fetch(
            "/api/leetcode-handle",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({leetcodeHandle})
            }
        );
        const message =
            document.getElementById(
                "lc-save-message"
            );
        message.textContent =
            "✓ Handle saved successfully";
        await fetchLeetCodeProfile(leetcodeHandle);
        await fetchLeetCodeStats(leetcodeHandle);
        setTimeout(() => {
            message.textContent = "";
        }, 3000);

    }
);
async function fetchLeetCodeStats(handle){
    try{
        const response =
            await fetch(
                `https://alfa-leetcode-api.onrender.com/${handle}/solved`
            );
        const data =
            await response.json();
        console.log(data);
        document.getElementById(
            "lc-total"
        ).textContent =
            data.solvedProblem ?? "--";
        document.getElementById(
            "lc-easy"
        ).textContent =
            data.easySolved ?? "--";
        document.getElementById(
            "lc-medium"
        ).textContent =
            data.mediumSolved ?? "--";
        document.getElementById(
            "lc-hard"
        ).textContent =
            data.hardSolved ?? "--";
    }
    catch(error){
        console.log(error);
    }

}
async function fetchLeetCodeProfile(handle){

    try{

        const response =
            await fetch(
                `https://alfa-leetcode-api.onrender.com/${handle}`
            );

        const data =
            await response.json();

        document.getElementById(
            "lc-username"
        ).textContent =
            handle;

        document.getElementById(
            "lc-ranking"
        ).textContent =
            data.ranking ?? "--";

        document.getElementById(
            "lc-country"
        ).textContent =
            "India";

        document.getElementById(
            "lc-avatar"
        ).src =
            "https://leetcode.com/favicon.ico";

    }
    catch(error){

        console.log(error);

    }

}
loadLeetCodeHandle();
loadUser();
loadSavedHandle();
loadDashboard();