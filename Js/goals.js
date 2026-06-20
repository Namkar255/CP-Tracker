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
        } else {
            active++;
        }
    }
    activeCount.textContent = active;
    completedCount.textContent = completed;
}
function complete(){
    if(this.checked){
        this.nextElementSibling.classList.add("completed");
    }
    else{
        this.nextElementSibling.classList.remove("completed");
    }
}
for (let i = 0; i < goalDelete.length; i++) {
    goalDelete[i].addEventListener("click", function () {
        this.parentElement.remove();
        updateCounts();
    });
}
for (let i = 0; i < goalCheckboxes.length; i++) {
    goalCheckboxes[i].addEventListener("change", updateCounts);
    goalCheckboxes[i].addEventListener("change", complete);
}
addGoalButton.addEventListener("click", function () {
    const goalText = goalInput.value.trim();
    if (goalText === "") {
        alert("Please enter a goal");
        return;
    }
    const newGoal = document.createElement("li");
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.classList.add("goal-checkbox");
    newCheckbox.addEventListener("change", updateCounts);
    newCheckbox.addEventListener("change", complete);
    const newLabel = document.createElement("div");
    newLabel.classList.add("goal-statement");
    newLabel.textContent = goalText;
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click", function () {
        newGoal.remove();
        updateCounts();
    });
    newGoal.appendChild(newCheckbox);
    newGoal.appendChild(newLabel);
    newGoal.appendChild(deleteButton);
    goalList.appendChild(newGoal);
    goalInput.value = "";
    updateCounts();
});
updateCounts();