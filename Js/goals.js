const addGoalButton = document.getElementById("add-goal-btn");
const goalInput = document.getElementById("goal-input");
const goalList = document.getElementById("goals-list");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");
const goalDelete = document.getElementsByClassName("delete-btn");
const goalCheckboxes = document.getElementsByClassName("goal-checkbox");

function updateCounts() {
    let active = 0;
    let completed = 0;
    for (let i = 0; i < goalCheckboxes.length; i++) {
        if (goalCheckboxes[i].checked) {
            completed++;
        }
        else {
            active++;
        }
    }
    activeCount.textContent = active;
    completedCount.textContent = completed;
}
function complete() {
    if (this.checked) {
        this.nextElementSibling.classList.add("completed");
    }
    else {
        this.nextElementSibling.classList.remove("completed");
    }
}
function saveGoals() {
    const goals = [];
    const allGoals = document.querySelectorAll("#goals-list li");
    for (const goal of allGoals) {
        const text = goal.querySelector(".goal-statement").textContent;
        const completed = goal.querySelector(".goal-checkbox").checked;
        goals.push({
            text,
            completed
        });
    }
    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );
}
function loadGoals() {
    const storedGoals =
        JSON.parse(localStorage.getItem("goals"));
    if (!storedGoals) return;
    goalList.innerHTML = "";
    for (const goal of storedGoals) {
        const newGoal = document.createElement("li");
        const newCheckbox =
            document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.classList.add("goal-checkbox");
        newCheckbox.checked = goal.completed;
        newCheckbox.addEventListener("change", function () {
            updateCounts();
            saveGoals();
        });
        newCheckbox.addEventListener("change", complete);
        const newLabel =
            document.createElement("div");
        newLabel.classList.add("goal-statement");
        newLabel.textContent = goal.text;
        if (goal.completed) {
            newLabel.classList.add("completed");
        }
        const deleteButton =
            document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "🗑";
        deleteButton.addEventListener("click", function () {
            newGoal.remove();
            updateCounts();
            saveGoals();
        });
        newGoal.appendChild(newCheckbox);
        newGoal.appendChild(newLabel);
        newGoal.appendChild(deleteButton);
        goalList.appendChild(newGoal);
    }
    updateCounts();
}

for (let i = 0; i < goalDelete.length; i++) {
    goalDelete[i].addEventListener("click", function () {
        this.parentElement.remove();
        updateCounts();
        saveGoals();
    });
}

for (let i = 0; i < goalCheckboxes.length; i++) {
    goalCheckboxes[i].addEventListener("change", updateCounts);
    goalCheckboxes[i].addEventListener("change", complete);
    goalCheckboxes[i].addEventListener("change", saveGoals);
}

addGoalButton.addEventListener("click", function () {
    const goalText = goalInput.value.trim();
    if (goalText === "") {
        alert("Please enter a goal");
        return;
    }
    const newGoal = document.createElement("li");
    const newCheckbox =
        document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.classList.add("goal-checkbox");
    newCheckbox.addEventListener("change", function () {
        updateCounts();
        saveGoals();
    });
    newCheckbox.addEventListener("change", complete);
    const newLabel =
        document.createElement("div");
    newLabel.classList.add("goal-statement");
    newLabel.textContent = goalText;
    const deleteButton =
        document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click", function () {
        newGoal.remove();
        updateCounts();
        saveGoals();
    });
    newGoal.appendChild(newCheckbox);
    newGoal.appendChild(newLabel);
    newGoal.appendChild(deleteButton);
    goalList.appendChild(newGoal);
    goalInput.value = "";
    updateCounts();
    saveGoals();
});
loadGoals();
updateCounts();