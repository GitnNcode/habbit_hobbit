document.addEventListener("DOMContentLoaded", function() {
    const habitContainer = document.getElementById("habit-container");
    const storedHabits = JSON.parse(localStorage.getItem("habits")) || [
        { id: "read", title: "Read", emoji: "📚", streak: 0, lastChecked: "" },
        { id: "workout", title: "Workout", emoji: "💪", streak: 0, lastChecked: "" },
        { id: "meditate", title: "Meditate", emoji: "☁️", streak: 0, lastChecked: "" }
    ];

    function renderHabits() {
        habitContainer.innerHTML = "";
        storedHabits.forEach(habit => {
            const habitDiv = document.createElement("div");
            habitDiv.classList.add("habit");
            habitDiv.id = habit.id;
            if (habit.completed) habitDiv.classList.add("completed");

            habitDiv.innerHTML = `
                <h2>${habit.title} ${habit.emoji}</h2>
                <p>Streak: <span class="streak">${habit.streak}</span></p>
                <input type="checkbox" ${habit.completed ? "checked" : ""}>
            `;

            const checkbox = habitDiv.querySelector("input");
            const streakElement = habitDiv.querySelector(".streak");
            checkbox.addEventListener("change", function() {
                const today = new Date().toDateString();
                if (checkbox.checked) {
                    if (habit.lastChecked !== today) {
                        habit.streak++;
                        habit.lastChecked = today;
                    }
                    habit.completed = true;
                } else {
                    habit.completed = false;
                }
                streakElement.textContent = habit.streak;
                habitDiv.classList.toggle("completed", habit.completed);
                localStorage.setItem("habits", JSON.stringify(storedHabits));
            });

            habitContainer.appendChild(habitDiv);
        });
    }

    renderHabits();

    document.getElementById("reset-btn").addEventListener("click", function() {
        localStorage.removeItem("habits");
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
});