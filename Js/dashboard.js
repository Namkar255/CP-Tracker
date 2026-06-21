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

fetchBtn.addEventListener("click", async function () {
    const handle = handleInput.value.trim();
    if(handle === ""){
        alert("Enter a Codeforces handle");
        return;
    }
    try{
        const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`
        );
        const data = await response.json();
        const contestResponse = await fetch(
            `https://codeforces.com/api/user.rating?handle=${handle}`
        );
        const contestData = await contestResponse.json();
        if(data.status !== "OK"){
            alert("User not found");
            return;
        }
        const user = data.result[0];
        rating.textContent = user.rating ?? "Unrated";
        rank.textContent = user.rank ?? "Unrated";
        maxRating.textContent = user.maxRating ?? "Unrated";
        maxRank.textContent = user.maxRank ?? "Unrated";
        contribution.textContent = user.contribution ?? "N/A";
        friendOfCount.textContent = user.friendOfCount ?? "N/A";
        avatar.src = user.titlePhoto ?? "N/A";

        contestList.innerHTML = "";
        const contests =contestData.result.slice(-5).reverse();
        for(const contest of contests){
            const card =document.createElement("div");
            card.classList.add("contest-card");
            const change = contest.newRating - contest.oldRating;
            const color = change >= 0 ? "lime" : "red";
            card.innerHTML = `
                <h3>${contest.contestName}</h3>
                <p>Rank: ${contest.rank}</p>
                <p>Old Rating: ${contest.oldRating}</p>
                <p>New Rating: ${contest.newRating}</p>
                <p style="color:${color}">
                    Change: ${change > 0 ? "+" : ""}${change}
                </p>
            `;
            contestList.appendChild(card);
        }
    }
    catch(error){
        console.log(error);
        alert("Something went wrong");
    }
});
function loadActivity() {
    const goals =
        JSON.parse(
            localStorage.getItem("goals")
        ) || [];
    activityList.innerHTML = "";
    const completedGoals =
        goals.filter(
            goal => goal.completed
        );
    if(completedGoals.length === 0){
        activityList.innerHTML =
            "<li>No completed goals yet</li>";
        return;
    }
    for(const goal of completedGoals){
        const item = document.createElement("li");
        item.textContent = "Completed: " + goal.text;
        activityList.appendChild(item);
    }
}
function loadProgress() {
    const goals =
        JSON.parse(
            localStorage.getItem("goals")
        ) || [];
    const totalGoals =goals.length;
    const completedGoals =
        goals.filter(
            goal => goal.completed
        ).length;
    let percentage = 0;
    if(totalGoals > 0){
        percentage =
            Math.round(
                (completedGoals / totalGoals) * 100
            );

    }
    progressFill.style.width =percentage + "%";
    progressText.textContent =percentage + "% Completed";
}
loadActivity();
loadProgress();