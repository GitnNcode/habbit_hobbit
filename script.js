document.addEventListener("DOMContentLoaded", function() {
    const habits = ["read", "workout", "meditate"];

    habits.forEach(habit => {
        const checkBox = document.getElementById(`${habit}-check`);
        const streakElement = document.getElementById(`${habit}-streak`);

        let streak = localStorage.getItem(`${habit}-streak`) || 0;
        streakElement.textContent = streak;

        checkBox.addEventListener("change", function() {
            if (checkBox.checked) {
                streak++;
            } else {
                streak = 0;
            }
            streakElement.textContent = streak;
            localStorage.setItem(`${habit}-streak`, streak);
        });
    });

    document.getElementById("reset-btn").addEventListener("click", function() {
        habits.forEach(habit => {
            localStorage.setItem(`${habit}-streak`, 0);
            document.getElementById(`${habit}-streak`).textContent = 0;
        });
    });

    document.getElementById("add-habit-btn").addEventListener("click", function() {
        const habitTitle = prompt("Enter the new habit title:");
        if (habitTitle) {
            const newHabit = document.createElement("div");
            newHabit.classList.add("habit");
            newHabit.innerHTML = `
                <h2>${habitTitle}</h2>
                <p>Streak: <span class="streak">0</span></p>
                <input type="checkbox">
            `;
            document.getElementById("habit-container").appendChild(newHabit);
        }
    });
});