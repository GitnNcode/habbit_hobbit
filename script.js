document.addEventListener("DOMContentLoaded", function() {
    const habitContainer = document.getElementById("habit-container");
    const defaultHabits = [
        { id: "read", title: "Read", emoji: "📚", streak: 0, completed: false },
        { id: "workout", title: "Workout", emoji: "💪", streak: 0, completed: false },
        { id: "meditate", title: "Meditate", emoji: "☁️", streak: 0, completed: false }
    ];
    let storedHabits = JSON.parse(localStorage.getItem("habits")) || defaultHabits;

    function renderHabits() {
        habitContainer.innerHTML = "";
        storedHabits.forEach(habit => {
            const habitDiv = document.createElement("div");
            habitDiv.classList.add("habit");
            habitDiv.id = habit.id;
            if (habit.completed) habitDiv.classList.add("completed");

            habitDiv.innerHTML = `
                <h2>${habit.title} ${habit.emoji}</h2>
                <p class="streak">Streak: <span>${habit.streak}</span></p>
                <input type="checkbox" ${habit.completed ? "checked disabled" : ""}>
            `;

            const checkbox = habitDiv.querySelector("input");
            const streakElement = habitDiv.querySelector(".streak span");
            checkbox.addEventListener("change", function() {
                if (checkbox.checked) {
                    habit.streak++;
                    habit.completed = true;
                    checkbox.disabled = true;
                }
                streakElement.textContent = habit.streak;
                habitDiv.classList.toggle("completed", habit.completed);
                localStorage.setItem("habits", JSON.stringify(storedHabits));
            });

            habitContainer.appendChild(habitDiv);
        });
    }

    document.getElementById("reset-btn").addEventListener("click", function() {
        localStorage.setItem("habits", JSON.stringify(defaultHabits));
        location.reload();
    });

    document.getElementById("add-habit-btn").addEventListener("click", function() {
        const title = prompt("Enter the new habit title:");
        const emoji = prompt("Enter an emoji for this habit:");
        if (title && emoji) {
            const newHabit = { id: title.toLowerCase().replace(/\s+/g, "-"), title, emoji, streak: 0, lastChecked: "", completed: false };
            storedHabits.push(newHabit);
            localStorage.setItem("habits", JSON.stringify(storedHabits));
            renderHabits();
        }
    });
    renderHabits();
});