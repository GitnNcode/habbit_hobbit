document.addEventListener("DOMContentLoaded", function() {
    const habitContainer = document.getElementById("habit-container");
    const resetButton = document.getElementById("reset-btn");
    const addHabitButton = document.getElementById("add-habit-btn");

    function loadHabits() {
        habitContainer.innerHTML = "";
        const habits = JSON.parse(localStorage.getItem("habits")) || [];
        habits.forEach(habit => addHabitToDOM(habit.title, habit.emoji, habit.streak));
    }

    function saveHabits() {
        const habits = Array.from(document.querySelectorAll(".habit"))
            .map(habit => ({
                title: habit.dataset.title,
                emoji: habit.dataset.emoji,
                streak: habit.querySelector(".streak").textContent
            }));
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    function addHabitToDOM(title, emoji, streak = 0) {
        const habitDiv = document.createElement("div");
        habitDiv.classList.add("habit");
        habitDiv.dataset.title = title;
        habitDiv.dataset.emoji = emoji;
        habitDiv.innerHTML = `
            <h2>${title} ${emoji}</h2>
            <p>Streak: <span class="streak">${streak}</span></p>
            <input type="checkbox">
        `;
        
        const checkbox = habitDiv.querySelector("input[type='checkbox']");
        const streakElement = habitDiv.querySelector(".streak");
        checkbox.addEventListener("change", function() {
            let count = parseInt(streakElement.textContent);
            if (checkbox.checked) {
                count++;
                habitDiv.classList.add("completed");
            } else {
                count = Math.max(0, count - 1);
                habitDiv.classList.remove("completed");
            }
            streakElement.textContent = count;
            saveHabits();
        });
        
        habitContainer.appendChild(habitDiv);
        saveHabits();
    }

    addHabitButton.addEventListener("click", function() {
        const title = prompt("Enter the new habit title:");
        const emoji = prompt("Enter an emoji for this habit:");
        if (title && emoji) addHabitToDOM(title, emoji);
    });

    resetButton.addEventListener("click", function() {
        localStorage.removeItem("habits");
        loadHabits();
    });

    loadHabits();
});