document.addEventListener("DOMContentLoaded", function () {
    const habitContainer = document.getElementById("habit-container");
    const resetButton = document.getElementById("reset-btn");
    const addHabitButton = document.getElementById("add-habit-btn");

    const DEFAULT_HABITS = [
        { id: "read", title: "Read", emoji: "📚", streak: 0, lastChecked: "" },
        { id: "workout", title: "Workout", emoji: "💪", streak: 0, lastChecked: "" },
        { id: "meditate", title: "Meditate", emoji: "☁️", streak: 0, lastChecked: "" }
    ];

    function getTodayDate() {
        return new Date().toDateString(); // e.g., "Thu Feb 22 2025"
    }

    function loadHabits() {
        habitContainer.innerHTML = "";
        let habits = JSON.parse(localStorage.getItem("habits")) || [];

        if (habits.length === 0) {
            habits = DEFAULT_HABITS;
            localStorage.setItem("habits", JSON.stringify(habits));
        }

        const today = getTodayDate();
        localStorage.setItem("lastVisitDate", today); // Store the current date

        habits.forEach(habit => {
            if (habit.lastChecked !== today) {
                habit.checked = false; // Reset checkboxes for a new day
            }
            addHabitToDOM(habit.id, habit.title, habit.emoji, habit.streak, habit.lastChecked, habit.checked);
        });

        saveHabits();
    }

    function saveHabits() {
        const habits = Array.from(document.querySelectorAll(".habit")).map(habit => ({
            id: habit.dataset.id,
            title: habit.dataset.title,
            emoji: habit.dataset.emoji,
            streak: parseInt(habit.querySelector(".streak").textContent),
            lastChecked: habit.dataset.lastChecked,
            checked: habit.querySelector("input[type='checkbox']").checked
        }));
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    function addHabitToDOM(id, title, emoji, streak = 0, lastChecked = "", checked = false) {
        const habitDiv = document.createElement("div");
        habitDiv.classList.add("habit");
        habitDiv.dataset.id = id;
        habitDiv.dataset.title = title;
        habitDiv.dataset.emoji = emoji;
        habitDiv.dataset.lastChecked = lastChecked;

        habitDiv.innerHTML = `
            <!-- <button class="delete-btn">❌</button> -->
            <button class="delete-btn">🗑️</button>
            <h2>${title} ${emoji}</h2>
            <p>Streak: <span class="streak">${streak}</span></p>
            <input type="checkbox" ${checked ? "checked disabled" : ""}>
        `;

        const checkbox = habitDiv.querySelector("input[type='checkbox']");
        const streakElement = habitDiv.querySelector(".streak");
        const removeButton = habitDiv.querySelector(".delete-btn");

        if (checked) {
            habitDiv.classList.add("completed");
        }

        checkbox.addEventListener("change", function () {
            updateStreak(habitDiv, checkbox, streakElement);
        });

        removeButton.addEventListener("click", function () {
            removeHabit(habitDiv);
        });

        habitContainer.appendChild(habitDiv);
        saveHabits();
    }

    function updateStreak(habitDiv, checkbox, streakElement) {
        const today = getTodayDate();
        let count = parseInt(streakElement.textContent);

        if (habitDiv.dataset.lastChecked !== today) {
            count++;
            habitDiv.dataset.lastChecked = today;
            streakElement.textContent = count;
            checkbox.disabled = true;
            habitDiv.classList.add("completed");
        } else {
            checkbox.checked = true;
        }

        saveHabits();
    }

    function removeHabit(habitDiv) {
        habitDiv.remove();
        saveHabits();
    }

    function validateInput(title, emoji) {
        if (!title.trim()) {
            alert("Habit title cannot be empty!");
            return false;
        }
        if (!/^\p{Emoji}$/u.test(emoji)) {
            alert("Please enter a valid emoji!");
            return false;
        }
        return true;
    }

    function checkForNewDay() {
        const lastVisit = localStorage.getItem("lastVisitDate") || "";
        const today = getTodayDate();

        if (lastVisit !== today) {
            location.reload(); // Reload the page if a new day starts
        }
    }

    addHabitButton.addEventListener("click", function () {
        const title = prompt("Enter the new habit title:");
        const emoji = prompt("Enter an emoji for this habit:");
        if (validateInput(title, emoji)) {
            addHabitToDOM(title.replace(/\s+/g, "-").toLowerCase(), title, emoji);
        }
    });

    resetButton.addEventListener("click", function () {
        localStorage.removeItem("habits");
        loadHabits();
    });

    loadHabits();

    // Check every 30 seconds if a new day has started
    setInterval(checkForNewDay, 30);
});
