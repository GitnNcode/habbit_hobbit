document.addEventListener("DOMContentLoaded", function () {
    const habitContainer = document.getElementById("habit-container");
    const resetButton = document.getElementById("reset-btn");
    const addHabitButton = document.getElementById("add-habit-btn");

    const DEFAULT_HABITS = [
        { id: "read", title: "Read", emoji: "📚", streak: 0, lastChecked: "" },
        { id: "workout", title: "Workout", emoji: "💪", streak: 0, lastChecked: "" },
        { id: "meditate", title: "Meditate", emoji: "☁️", streak: 0, lastChecked: "" }
    ];

    function loadHabits() {
        habitContainer.innerHTML = "";
        let habits = JSON.parse(localStorage.getItem("habits"));

        if (!habits || habits.length === 0) {
            // If no habits exist, set defaults
            habits = DEFAULT_HABITS;
            localStorage.setItem("habits", JSON.stringify(habits));
        }

        habits.forEach(habit => addHabitToDOM(habit.title, habit.emoji, habit.streak, habit.lastChecked, habit.checked));
    }

    function saveHabits() {
        const habits = Array.from(document.querySelectorAll(".habit")).map(habit => ({
            title: habit.dataset.title,
            emoji: habit.dataset.emoji,
            streak: habit.querySelector(".streak").textContent,
            lastChecked: habit.dataset.lastChecked || "",
            checked: habit.querySelector("input[type='checkbox']").checked
        }));
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    function addHabitToDOM(title, emoji, streak = 0, lastChecked = "", checked = false) {
        const habitDiv = document.createElement("div");
        habitDiv.classList.add("habit");
        habitDiv.dataset.title = title;
        habitDiv.dataset.emoji = emoji;
        habitDiv.dataset.lastChecked = lastChecked;
    
        habitDiv.innerHTML = `
            <button class="delete-btn">❌</button>
            <h2>${title} ${emoji}</h2>
            <p>Streak: <span class="streak">${streak}</span></p>
            <input type="checkbox">
        `;
    
        const checkbox = habitDiv.querySelector("input[type='checkbox']");
        const streakElement = habitDiv.querySelector(".streak");
        const removeButton = habitDiv.querySelector(".delete-btn");
    
        // Load checkbox state
        checkbox.checked = checked;
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
        let count = parseInt(streakElement.textContent);
        const today = new Date().toDateString();
        const lastChecked = habitDiv.dataset.lastChecked;

        if (checkbox.checked) {
            habitDiv.classList.add("completed");

            if (lastChecked !== today) {
                count++;
                habitDiv.dataset.lastChecked = today;
            }
        } else {
            habitDiv.classList.remove("completed");
        }

        streakElement.textContent = count;
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

    addHabitButton.addEventListener("click", function () {
        const title = prompt("Enter the new habit title:");
        const emoji = prompt("Enter an emoji for this habit:");
        if (validateInput(title, emoji)) {
            addHabitToDOM(title, emoji);
        }
    });

    resetButton.addEventListener("click", function () {
        localStorage.removeItem("habits");
        loadHabits();
    });

    loadHabits();
});

