const addGoalButton = document.getElementById("add-goal-btn");
const goalInput = document.getElementById("goal-input");
const goalList =document.getElementById("goals-list");

const activeCount =document.getElementById("active-count");

const completedCount =document.getElementById("completed-count");

function updateCounts() {
    const goalCheckboxes =document.querySelectorAll(".goal-checkbox");
    let active = 0;
    let completed = 0;
    for(const checkbox of goalCheckboxes){
        if(checkbox.checked){
            completed++;
        }
        else{
            active++;
        }
    }
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

function createGoal(goal){
    const newGoal =
        document.createElement("li");
    const newCheckbox =
        document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.classList.add("goal-checkbox");
    newCheckbox.checked = goal.completed;
    newCheckbox.addEventListener("change", async function(){
        await fetch(
            `/api/goals/${goal.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    completed: this.checked
                })
            }
        );
        updateCounts();
        if(this.checked){
            this.nextElementSibling
                .classList.add("completed");
        }
        else{
            this.nextElementSibling
                .classList.remove("completed");
        }
    }
);

    const newLabel =document.createElement("div");
    newLabel.classList.add("goal-statement");
    newLabel.textContent = goal.goal_text;
    if(goal.completed){
        newLabel.classList.add("completed");
    }
    const deleteButton =document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click",async function(){
        await fetch(
            `/api/goals/${goal.id}`,
            {
                method: "DELETE"
            }
        );
        newGoal.remove();
        updateCounts();
    }
);

    newGoal.appendChild(newCheckbox);
    newGoal.appendChild(newLabel);
    newGoal.appendChild(deleteButton);

    goalList.appendChild(newGoal);
}

async function loadGoals(){
    try{
        const response =
            await fetch("/api/goals");
        const goals =
            await response.json();
        goalList.innerHTML = "";
        for(const goal of goals){
            createGoal(goal);
        }
        updateCounts();
    }
    catch(error){
        console.log(error);
    }

}
addGoalButton.addEventListener(
    "click",
    async function(){
        const goalText =
            goalInput.value.trim();
        if(goalText === ""){
            alert("Please enter a goal");
            return;
        }
        try{
           const response =
                await fetch(
                    "/api/goals",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                            "application/json"
                        },

                        body: JSON.stringify({
                            goalText
                        })
                    }
                );

            const goal =
                await response.json();

            createGoal(goal);
            goalInput.value = "";
            updateCounts();

        }
        catch(error){
            console.log(error);
        }

    }
);

loadGoals();